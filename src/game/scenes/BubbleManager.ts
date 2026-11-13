import Phaser from 'phaser';

/**
 * مدیریت ایجاد و نمایش حباب‌های چت و استیکرها بالای سر کاراکتر
 */
export class BubbleManager {
  private activeBubble: Phaser.GameObjects.Container | null = null;
  private fadeTween: Phaser.Tweens.Tween | null = null;

  constructor(private scene: Phaser.Scene) {}

  public showBubble(
    target: Phaser.GameObjects.Image,
    text: string,
    isEmoji = false
  ): void {
    // پاک کردن حباب قبلی
    this.destroyActiveBubble();

    const container = this.scene.add.container(target.x, target.y - 54);
    container.setDepth(target.depth + 50);

    const isLongText = text.length > 15;
    const paddingX = isEmoji ? 12 : 14;
    const paddingY = 8;
    const fontSize = isEmoji ? '22px' : isLongText ? '13px' : '15px';

    const label = this.scene.add.text(0, 0, text, {
      fontFamily: 'RooyinBold, sans-serif',
      fontSize,
      color: '#f6e9d7',
      align: 'center',
    }).setOrigin(0.5);

    const width = Math.max(isEmoji ? 42 : 60, label.width + paddingX * 2);
    const height = Math.max(34, label.height + paddingY * 2);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x180e0b, 0.95);
    bg.lineStyle(1.5, 0xf09d38, 0.9);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);

    // زبانه حباب
    bg.fillTriangle(-4, height / 2, 4, height / 2, 0, height / 2 + 6);

    container.add([bg, label]);
    container.setScale(0.5);
    container.setAlpha(0);

    // انیمیشن پاپ‌آپ
    this.scene.tweens.add({
      targets: container,
      scale: 1,
      alpha: 1,
      duration: 200,
      ease: 'Back.easeOut',
    });

    // محو شدن خودکار بعد از ۳ ثانیه
    this.fadeTween = this.scene.tweens.add({
      targets: container,
      alpha: 0,
      y: container.y - 15,
      delay: 3000,
      duration: 400,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.destroyActiveBubble();
      },
    });

    this.activeBubble = container;
  }

  public updatePosition(target: Phaser.GameObjects.Image): void {
    if (this.activeBubble) {
      this.activeBubble.setPosition(target.x, target.y - 54);
      this.activeBubble.setDepth(target.depth + 50);
    }
  }

  public destroyActiveBubble(): void {
    if (this.fadeTween) {
      this.fadeTween.stop();
      this.fadeTween = null;
    }
    if (this.activeBubble) {
      this.activeBubble.destroy();
      this.activeBubble = null;
    }
  }
}
