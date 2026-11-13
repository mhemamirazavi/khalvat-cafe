export const COLS = 12;
export const ROWS = 10;
export const TILE_SIZE = 48;

/**
 * بررسی قابل عبور بودن خانه در مپ ۱۲ در ۱۰
 */
export function isTileBlocked(gx: number, gy: number, ignoreChairs = false): boolean {
  if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return true;
  // ردیف ۰ و ۱ دیوارهای بالایی هستند
  if (gy <= 1) return true;
  // پیشخوان بار در خانه‌های ۱ تا ۴ در ردیف ۲
  if (gx >= 1 && gx <= 4 && gy === 2) return true;
  // میز کافه در خانه (6, 5)
  if (gx === 6 && gy === 5) return true;
  // صندلی‌ها در (5, 5) و (7, 5) مگر اینکه مقصد نشستن باشند
  if (!ignoreChairs && ((gx === 5 && gy === 5) || (gx === 7 && gy === 5))) {
    return false; // برای نشستن در دسترس است
  }
  return false;
}

export function tileToPixel(gx: number, gy: number, ox: number, oy: number): { x: number; y: number } {
  return {
    x: ox + gx * TILE_SIZE + TILE_SIZE / 2,
    y: oy + gy * TILE_SIZE + TILE_SIZE, // کف تایل
  };
}

export function pixelToTile(px: number, py: number, ox: number, oy: number): { gx: number; gy: number } {
  return {
    gx: Math.floor((px - ox) / TILE_SIZE),
    gy: Math.floor((py - oy) / TILE_SIZE),
  };
}

/**
 * الگوریتم BFS برای پیدا کردن کوتاه‌ترین مسیر تایل به تایل
 */
export function findPathBFS(
  startGx: number,
  startGy: number,
  targetGx: number,
  targetGy: number
): { gx: number; gy: number }[] {
  if (startGx === targetGx && startGy === targetGy) return [];
  if (isTileBlocked(targetGx, targetGy, true)) return [];

  const queue: { gx: number; gy: number; path: { gx: number; gy: number }[] }[] = [
    { gx: startGx, gy: startGy, path: [] },
  ];
  const visited = new Set<string>();
  visited.add(`${startGx},${startGy}`);

  const DIRS = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.gx === targetGx && cur.gy === targetGy) {
      return cur.path;
    }

    for (const d of DIRS) {
      const nx = cur.gx + d.dx;
      const ny = cur.gy + d.dy;
      const key = `${nx},${ny}`;

      if (!visited.has(key)) {
        const isDestination = nx === targetGx && ny === targetGy;
        if (!isTileBlocked(nx, ny, isDestination)) {
          visited.add(key);
          queue.push({
            gx: nx,
            gy: ny,
            path: [...cur.path, { gx: nx, gy: ny }],
          });
        }
      }
    }
  }

  return [];
}
