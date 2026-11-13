import Phaser from 'phaser';
import { buildCharacterTextures } from './charTextures';

/** ساخت تمام تکسچرهای پیکسلی 3/4 کافه (بر پایه تایل مربعی 48x48) */
export function buildCafeTextures(scene: Phaser.Scene): void {
  buildFloor(scene);
  buildWall(scene);
  buildWindow(scene);
  buildSign(scene);
  buildRug(scene);
  buildFurniture(scene);
  buildCharacterTextures(scene);
}

function gfx(scene: Phaser.Scene, key: string, w: number, h: number, draw: (g: Phaser.GameObjects.Graphics) => void): void {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({ x: 0, y: 0 });
  draw(g);
  g.generateTexture(key, w, h);
  g.destroy();
}

/** floor-wood: پارکت چوبی گرم کافه */
function buildFloor(scene: Phaser.Scene): void {
  gfx(scene, 'floor-wood', 48, 48, (g) => {
    g.fillStyle(0x3b2218, 1).fillRect(0, 0, 48, 48);
    g.fillStyle(0x2d1911, 1); // درزهای الوار
    g.fillRect(0, 15, 48, 2).fillRect(0, 31, 48, 2);
    g.fillRect(24, 0, 2, 15).fillRect(12, 17, 2, 14).fillRect(36, 33, 2, 15);
    g.fillStyle(0x452a1c, 0.6); // برق ملایم روی الوارها
    g.fillRect(0, 2, 48, 1).fillRect(0, 18, 48, 1).fillRect(0, 34, 48, 1);
  });
}

/** wall-brick: دیوار آجری با قرنیز چوبی پایین */
function buildWall(scene: Phaser.Scene): void {
  gfx(scene, 'wall-brick', 48, 48, (g) => {
    g.fillStyle(0x4e3126, 1).fillRect(0, 0, 48, 48); // ملات بین آجرها
    g.fillStyle(0x5a3a2c, 1); // آجرها با چینش منقطع
    for (let r = 0; r < 5; r++) {
      const yy = 2 + r * 8;
      const off = r % 2 === 0 ? 0 : 12;
      for (let c = -1; c < 3; c++) g.fillRect(off + c * 24 + 1, yy, 22, 6);
    }
    g.fillStyle(0x42261b, 1).fillRect(0, 40, 48, 8); // قرنیز چوبی
    g.fillStyle(0x6b4226, 1).fillRect(0, 40, 48, 2); // لبه روشن قرنیز
  });
}

/** window-rain: پنجره قاب‌چوبی با نمای شب شهر و باران (مستقیم روی دیوار) */
function buildWindow(scene: Phaser.Scene): void {
  gfx(scene, 'window-rain', 96, 48, (g) => {
    g.fillStyle(0x0c1220, 1).fillRect(4, 4, 88, 40); // آسمان شب
    g.fillStyle(0xe8b04a, 0.85); // چراغ‌های شهر
    g.fillRect(14, 30, 3, 5).fillRect(24, 26, 4, 8).fillRect(40, 32, 3, 4)
      .fillRect(58, 24, 4, 10).fillRect(72, 30, 3, 6).fillRect(82, 27, 3, 8);
    g.fillStyle(0x9fc0e8, 0.9).fillCircle(76, 12, 4); // ماه
    g.lineStyle(1, 0x7da4cf, 0.75); // قطرات باران مایل
    const drops = [[12, 8], [30, 6], [48, 10], [64, 7], [20, 18], [38, 16], [56, 20], [80, 18], [27, 33], [51, 30]];
    drops.forEach(([x, y]) => g.lineBetween(x, y, x - 2, y + 6));
    g.lineStyle(4, 0x3b2218, 1).strokeRect(2, 2, 92, 44); // قاب چوبی
    g.lineStyle(3, 0x3b2218, 1).lineBetween(48, 2, 48, 46).lineBetween(2, 24, 94, 24); // تیرک‌ها
    g.fillStyle(0x6b4226, 1).fillRect(0, 44, 96, 4); // لبه پایین قاب
  });
}

/** cafe-sign: تابلو چوبی «کافه خلوت» روی دیوار */
function buildSign(scene: Phaser.Scene): void {
  gfx(scene, 'cafe-sign', 48, 32, (g) => {
    g.fillStyle(0x2d1911, 1).fillRoundedRect(0, 0, 48, 32, 4); // تخته چوبی
    g.fillStyle(0x3b2218, 1).fillRoundedRect(2, 2, 44, 28, 3);
    g.lineStyle(2, 0xbf9540, 1).strokeRoundedRect(3, 3, 42, 26, 3); // قاب طلایی
    g.fillStyle(0xf6e9d7, 1); // فنجان دودکن ساده
    g.fillRect(18, 14, 12, 8);
    g.fillRect(30, 16, 4, 4);
    g.lineStyle(1.5, 0xf6e9d7, 0.8);
    g.lineBetween(21, 10, 23, 6).lineBetween(26, 10, 28, 6); // دود
    g.fillStyle(0xf09d38, 1).fillRect(14, 26, 20, 2); // خط تزئینی زیر
  });
}

/** rug-persian: فرش زرشکی طرح‌دار زیر میز */
function buildRug(scene: Phaser.Scene): void {
  gfx(scene, 'rug-persian', 144, 96, (g) => {
    g.fillStyle(0x7a1d1d, 1).fillRoundedRect(0, 0, 144, 96, 6); // زمینه زرشکی
    g.lineStyle(4, 0xbf9540, 1).strokeRoundedRect(5, 5, 134, 86, 4); // حاشیه طلایی
    g.lineStyle(2, 0xf6e9d7, 0.7).strokeRoundedRect(12, 12, 120, 72, 3); // حاشیه کرم
    g.fillStyle(0xbf9540, 1).fillEllipse(72, 48, 44, 30); // ترنج مرکزی
    g.fillStyle(0x5c1212, 1).fillEllipse(72, 48, 26, 16);
    g.fillStyle(0xf09d38, 1).fillEllipse(72, 48, 10, 7);
    g.fillStyle(0xbf9540, 0.9); // گل‌های چهارگوشه
    [[20, 20], [124, 20], [20, 76], [124, 76]].forEach(([x, y]) => g.fillCircle(x, y, 5));
  });
}

function buildFurniture(scene: Phaser.Scene): void {
  // table-cafe: میز چوبی با دو فنجان قهوه و شمع روشن
  gfx(scene, 'table-cafe', 64, 52, (g) => {
    g.fillStyle(0x000000, 0.3).fillEllipse(32, 49, 46, 10); // سایه
    g.fillStyle(0x23140c, 1).fillRect(28, 28, 8, 20); // پایه
    g.fillStyle(0x6b4226, 1).fillEllipse(32, 22, 58, 28); // صفحه
    g.fillStyle(0x4e2b19, 1).fillEllipse(32, 23, 50, 22);
    g.fillStyle(0xf6e9d7, 1).fillCircle(18, 20, 4).fillCircle(46, 20, 4); // فنجان‌ها
    g.fillStyle(0x3b2218, 1).fillCircle(18, 20, 2.5).fillCircle(46, 20, 2.5); // قهوه
    g.fillStyle(0xf6e9d7, 1).fillRect(30, 13, 4, 7); // شمع
    g.fillStyle(0xf09d38, 1).fillCircle(32, 10, 3); // شعله
    g.fillStyle(0xffe27c, 1).fillCircle(32, 9, 1.5);
  });
  // chair-left / chair-right: صندلی‌های دنج دو طرف میز
  gfx(scene, 'chair-left', 32, 40, (g) => {
    g.fillStyle(0x1d1008, 1).fillRect(6, 26, 4, 12).fillRect(22, 26, 4, 12); // پایه‌ها
    g.fillStyle(0x4a2817, 1).fillRoundedRect(4, 20, 24, 10, 3); // نشیمن
    g.fillStyle(0x6b4226, 1).fillRect(4, 6, 6, 16); // پشتی
    g.fillStyle(0x8a5a38, 1).fillRect(5, 7, 4, 3);
  });
  gfx(scene, 'chair-right', 32, 40, (g) => {
    g.fillStyle(0x1d1008, 1).fillRect(6, 26, 4, 12).fillRect(22, 26, 4, 12);
    g.fillStyle(0x4a2817, 1).fillRoundedRect(4, 20, 24, 10, 3);
    g.fillStyle(0x6b4226, 1).fillRect(22, 6, 6, 16); // پشتی
    g.fillStyle(0x8a5a38, 1).fillRect(23, 7, 4, 3);
  });
  // counter-bar: پیشخوان بار با اسپرسوساز و گرامافون (۴ تایل پیاپی)
  gfx(scene, 'counter-bar', 192, 56, (g) => {
    g.fillStyle(0x27150c, 1).fillRect(0, 18, 192, 38); // بدنه
    g.fillStyle(0x3b2218, 1);
    for (let x = 12; x < 192; x += 24) g.fillRect(x, 24, 2, 28); // الوارها
    g.fillStyle(0x6b4226, 1).fillRect(0, 12, 192, 8); // صفحه رویی
    g.fillStyle(0x8a5a38, 1).fillRect(0, 12, 192, 2);
    g.fillStyle(0x9aa5b1, 1).fillRect(18, 2, 22, 12); // اسپرسوساز
    g.fillStyle(0x5a636e, 1).fillRect(20, 4, 18, 4);
    g.fillStyle(0xf09d38, 1).fillRect(26, 12, 4, 4); // چراغ دستگاه
    g.fillStyle(0x381f12, 1).fillRect(150, 6, 26, 8); // گرامافون: جعبه
    g.fillStyle(0xbf9540, 1).fillCircle(163, 6, 7); // صفحه گرامافون
    g.fillStyle(0x180e0b, 1).fillCircle(163, 6, 3);
  });
}

/** فریم مناسب بر اساس جهت نگاه: down=0, left=1, right=2, up=3 */
export function frameFromVector(dx: number, dy: number): number {
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 1 : 2;
  return dy < 0 ? 3 : 0;
}
