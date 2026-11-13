import { Scene, GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import { buildCafeTextures, frameFromVector } from '../utils/cafeTextures';
import { COLS, ROWS, TILE_SIZE, tileToPixel, pixelToTile, findPathBFS, isTileBlocked } from '../utils/gridPathfinder';
import { createCafeRoom } from '../utils/roomBuilder';
import { BubbleManager } from './BubbleManager';
import useCafeStore from '../../store/useCafeStore';

const WALK_SPEED = 2.5;

export class CafeIsometricScene extends Scene {
  private ox = 0;
  private oy = 0;
  private player!: GameObjects.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private isMovingPath = false;
  private facingFrame = 0;
  private bubbleManager!: BubbleManager;

  constructor() {
    super('CafeIsometricScene');
  }

  create(): void {
    buildCafeTextures(this);
    this.bubbleManager = new BubbleManager(this);

    this.calcOffset();
    createCafeRoom(this, this.ox, this.oy);

    const { myRole, gridX, gridY } = useCafeStore.getState();
    const texture = myRole === 'female' ? 'char-female' : 'char-male';
    const gx = gridX >= 0 && gridX < COLS ? gridX : 5;
    const gy = gridY >= 2 && gridY < ROWS ? gridY : 5;
    const pos = tileToPixel(gx, gy, this.ox, this.oy);

    this.player = this.add.image(pos.x, pos.y, texture).setOrigin(0.5, 1).setDepth(pos.y);
    this.player.setFrame(this.facingFrame);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>;
    }

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const t = pixelToTile(pointer.x, pointer.y, this.ox, this.oy);
      this.handleTileClick(t.gx, t.gy);
    });

    this.setupEvents();
    EventBus.emit('current-scene-ready', this);
  }

  update(): void {
    if (!this.player) return;
    this.player.setDepth(this.player.y); // Y-Sort: عمق = مختصات y کف کاراکتر
    this.bubbleManager.updatePosition(this.player);

    const { gx, gy } = pixelToTile(this.player.x, this.player.y, this.ox, this.oy);
    useCafeStore.getState().setGridPos(gx, gy);

    if (!this.isMovingPath) this.handleKeyboardMovement();
  }

  private calcOffset(): void {
    const { width, height } = this.scale;
    this.ox = Math.floor((width - COLS * TILE_SIZE) / 2);
    this.oy = Math.floor((height - ROWS * TILE_SIZE) / 2);
  }

  private handleKeyboardMovement(): void {
    let dx = 0;
    let dy = 0;
    if (this.cursors?.left.isDown || this.wasd?.A.isDown) dx -= WALK_SPEED;
    else if (this.cursors?.right.isDown || this.wasd?.D.isDown) dx += WALK_SPEED;
    if (this.cursors?.up.isDown || this.wasd?.W.isDown) dy -= WALK_SPEED;
    else if (this.cursors?.down.isDown || this.wasd?.S.isDown) dy += WALK_SPEED;
    if (dx === 0 && dy === 0) return;

    useCafeStore.getState().setIsSitting(false);
    this.facingFrame = frameFromVector(dx, dy);
    this.player.setFrame(this.facingFrame);

    const nextX = this.player.x + dx;
    const nextY = this.player.y + dy;
    const { gx, gy } = pixelToTile(nextX, nextY - TILE_SIZE / 2, this.ox, this.oy);
    const cur = pixelToTile(this.player.x, this.player.y - TILE_SIZE / 2, this.ox, this.oy);
    if (!isTileBlocked(gx, gy, true) || (gx === cur.gx && gy === cur.gy)) {
      this.player.setPosition(nextX, nextY);
    }
  }

  private handleTileClick(targetGx: number, targetGy: number): void {
    const isChair = (targetGx === 5 && targetGy === 5) || (targetGx === 7 && targetGy === 5);
    if (isTileBlocked(targetGx, targetGy) && !isChair) return;

    const cur = pixelToTile(this.player.x, this.player.y - TILE_SIZE / 2, this.ox, this.oy);
    const path = findPathBFS(cur.gx, cur.gy, targetGx, targetGy);
    if (path.length === 0) {
      if (isChair) this.sit(targetGx);
      return;
    }

    this.isMovingPath = true;
    useCafeStore.getState().setIsSitting(false);

    const steps = path.map((step) => {
      const p = tileToPixel(step.gx, step.gy, this.ox, this.oy);
      return {
        targets: this.player,
        x: p.x,
        y: p.y,
        duration: 180,
        ease: 'Linear',
        onStart: () => {
          const ddx = p.x - this.player.x;
          const ddy = p.y - this.player.y;
          this.facingFrame = frameFromVector(ddx, ddy);
          this.player.setFrame(this.facingFrame);
        },
      };
    });

    this.tweens.chain({
      tweens: steps,
      onComplete: () => {
        this.isMovingPath = false;
        if (isChair) this.sit(targetGx);
      },
    });
  }

  private sit(chairGx: number): void {
    useCafeStore.getState().setIsSitting(true);
    // نگاه به سمت میز: صندلی چپ به راست، صندلی راست به چپ
    this.facingFrame = chairGx === 5 ? 2 : 1;
    this.player.setFrame(this.facingFrame);
  }

  private setupEvents(): void {
    EventBus.on('show_reaction', (p: { emoji?: string; text?: string } | string) => {
      const text = typeof p === 'string' ? p : p.emoji || p.text || '☕';
      this.bubbleManager.showBubble(this.player, text, true);
    });

    EventBus.on('cafe-action', (act: string) => {
      const emoji = act === 'coffee' ? '☕' : act === 'heart' ? '❤️' : '👋';
      this.bubbleManager.showBubble(this.player, emoji, true);
    });

    EventBus.on('chat_message_sent', (msgText: string) => {
      this.bubbleManager.showBubble(this.player, msgText, false);
    });
  }
}

export default CafeIsometricScene;
