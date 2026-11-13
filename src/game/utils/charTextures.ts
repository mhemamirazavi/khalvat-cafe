import Phaser from 'phaser';

type Dir = 'up' | 'left' | 'right' | 'down';

interface CharacterSpec {
  skin: string; hair: string; hairLong: boolean; top: string;
  scarf: string; scarfPattern: string | null; bottom: string; shoes: string;
}

const MALE: CharacterSpec = {
  skin: '#f4cfb2', hair: '#23140c', hairLong: false,
  top: '#5a3018', scarf: '#f09d38', scarfPattern: null, // کاپشن قهوه‌ای + شال‌گردن
  bottom: '#28201a', shoes: '#19100a',
};
const FEMALE: CharacterSpec = {
  skin: '#f4cfb2', hair: '#401f11', hairLong: true,
  top: '#75231c', scarf: '#f6e9d7', scarfPattern: '#f09d38', // پالتو زرشکی + شال گل‌دار
  bottom: '#4a1d18', shoes: '#23140c',
};

const shade = (hex: string, amt: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.min(255, Math.max(0, v + amt));
  return `#${((f(n >> 16) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).padStart(6, '0')}`;
};

/** ساخت char-male و char-female به صورت شیت ۴ فریمه 32x48 (0=پایین 1=چپ 2=راست 3=بالا) */
export function buildCharacterTextures(scene: Phaser.Scene): void {
  makeSheet(scene, 'char-male', MALE);
  makeSheet(scene, 'char-female', FEMALE);
}

function makeSheet(scene: Phaser.Scene, key: string, spec: CharacterSpec): void {
  if (scene.textures.exists(key)) return;
  const cv = document.createElement('canvas');
  cv.width = 128;
  cv.height = 48;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  (['down', 'left', 'right', 'up'] as Dir[]).forEach((d, i) => drawFrame(ctx, i * 32, spec, d));
  scene.textures.addCanvas(key, cv);
}

function drawFrame(ctx: CanvasRenderingContext2D, ox: number, s: CharacterSpec, dir: Dir): void {
  const px = (x: number, y: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(ox + x, y, w, h);
  };
  px(8, 43, 16, 3, 'rgba(0,0,0,0.35)'); // سایه زیر پا
  px(10, 39, 4, 4, s.shoes); // کفش‌ها
  px(18, 39, 4, 4, s.shoes);
  px(10, 28, 12, 11, s.bottom); // شلوار/دامن
  px(10, 28, 12, 2, shade(s.bottom, -14));
  px(8, 15, 16, 13, s.top); // بدنه لباس
  px(8, 15, 16, 2, shade(s.top, 18));
  px(6, 17, 3, 9, s.top); // دست‌ها
  px(23, 17, 3, 9, s.top);
  px(6, 24, 3, 3, s.skin);
  px(23, 24, 3, 3, s.skin);
  px(10, 13, 12, 4, s.scarf); // شال
  if (s.scarfPattern) {
    px(12, 14, 2, 2, s.scarfPattern);
    px(19, 14, 2, 2, s.scarfPattern);
  }
  px(10, 5, 12, 9, s.skin); // سر
  px(9, 3, 14, 4, s.hair); // مو
  px(8, 5, 3, 5, s.hair);
  px(21, 5, 3, 5, s.hair);
  if (s.hairLong) {
    px(8, 10, 3, 12, s.hair);
    px(21, 10, 3, 12, s.hair);
  }
  const eye = '#25150f';
  if (dir === 'down') {
    px(12, 9, 2, 2, eye);
    px(18, 9, 2, 2, eye);
    px(14, 12, 4, 1, shade(s.skin, -22));
  } else if (dir === 'up') {
    px(9, 3, 14, 9, s.hair); // پشت سر
    px(10, 11, 12, 2, shade(s.hair, -12));
  } else if (dir === 'left') {
    px(11, 9, 2, 2, eye);
    px(10, 12, 2, 1, shade(s.skin, -22));
  } else {
    px(19, 9, 2, 2, eye);
    px(20, 12, 2, 1, shade(s.skin, -22));
  }
}
