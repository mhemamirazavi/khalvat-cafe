import Phaser from 'phaser';
import { COLS, ROWS, TILE_SIZE, tileToPixel } from './gridPathfinder';

/**
 * ساخت اتاق 12 در 10 کافه با مرتب‌سازی عمق Y-Sort:
 * کف depth=0 ، فرش depth=1 ، اشیاء و کاراکترها depth=y کف آن‌ها (Origin روی 0.5,1)
 */
export function createCafeRoom(
  scene: Phaser.Scene,
  ox: number,
  oy: number
): { table: Phaser.GameObjects.Image; chairL: Phaser.GameObjects.Image; chairR: Phaser.GameObjects.Image } {
  // ۱. رندر کف و دیوارها (ردیف 0 و 1 دیوار بالایی)
  for (let gy = 0; gy < ROWS; gy++) {
    for (let gx = 0; gx < COLS; gx++) {
      const key = gy <= 1 ? 'wall-brick' : 'floor-wood';
      scene.add.image(ox + gx * TILE_SIZE, oy + gy * TILE_SIZE, key).setOrigin(0, 0).setDepth(0);
    }
  }

  // ۲. پنجره بزرگ باران روی دیوار (تایل‌های 5 و 6 از ردیف دیوار)
  scene.add.image(ox + 5 * TILE_SIZE, oy + 10, 'window-rain').setOrigin(0, 0).setDepth(2);
  // ۳. تابلو چوبی کنار پنجره روی همان دیوار
  scene.add.image(ox + 8 * TILE_SIZE + 24, oy + 34, 'cafe-sign').setOrigin(0.5, 0.5).setDepth(2);

  // ۴. فرش زرشکی در مرکز اتاق (زیر میز) — depth=1
  const rugPos = tileToPixel(6, 5, ox, oy);
  scene.add.image(rugPos.x, rugPos.y - 24, 'rug-persian').setOrigin(0.5, 0.5).setDepth(1);

  // ۵. پیشخوان بار در تایل‌های (1..4, 2) — Origin روی کف، depth=y کف
  const barPos = tileToPixel(2.5, 2, ox, oy);
  scene.add.image(barPos.x, barPos.y, 'counter-bar').setOrigin(0.5, 1).setDepth(barPos.y);

  // ۶. صندلی‌ها در (5, 5) و (7, 5)
  const posChairL = tileToPixel(5, 5, ox, oy);
  const chairL = scene.add.image(posChairL.x, posChairL.y, 'chair-left');
  chairL.setOrigin(0.5, 1).setDepth(posChairL.y);
  const posChairR = tileToPixel(7, 5, ox, oy);
  const chairR = scene.add.image(posChairR.x, posChairR.y, 'chair-right');
  chairR.setOrigin(0.5, 1).setDepth(posChairR.y);

  // ۷. میز دو نفره در تایل (6, 5)
  const tablePos = tileToPixel(6, 5, ox, oy);
  const table = scene.add.image(tablePos.x, tablePos.y, 'table-cafe');
  table.setOrigin(0.5, 1).setDepth(tablePos.y);

  return { table, chairL, chairR };
}
