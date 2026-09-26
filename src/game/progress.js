/** 1 star for a clear, 2 if leftover is healthy, 3 if you smash with a big surplus. */
export function starRating({ leftover = 0, doorHp = 1 } = {}) {
  const hp = Math.max(1, Math.floor(Number(doorHp) || 1));
  const extra = Math.max(0, Math.floor(Number(leftover) || 0));
  if (extra >= Math.ceil(hp * 0.5)) return 3;
  if (extra >= Math.ceil(hp * 0.15)) return 2;
  return 1;
}

export function emptyLevelStat() {
  return { stars: 0, bestCoins: 0, bestCrowd: 0, completed: false };
}

export function mergeLevelStat(prev, next) {
  const a = { ...emptyLevelStat(), ...(prev && typeof prev === "object" ? prev : {}) };
  const b = next && typeof next === "object" ? next : {};
  return {
    completed: !!(a.completed || b.completed),
    stars: Math.max(0, Math.min(3, Math.max(a.stars || 0, b.stars || 0))),
    bestCoins: Math.max(0, a.bestCoins || 0, b.bestCoins || 0),
    bestCrowd: Math.max(0, a.bestCrowd || 0, b.bestCrowd || 0),
  };
}

export function sanitizeStats(raw, lastIndex = 55) {
  const src = raw && typeof raw === "object" ? raw : {};
  const out = {};
  for (let i = 0; i <= lastIndex; i++) {
    const row = src[i] ?? src[String(i)];
    if (!row || typeof row !== "object") continue;
    out[i] = mergeLevelStat(emptyLevelStat(), {
      completed: row.completed === true,
      stars: row.stars,
      bestCoins: row.bestCoins,
      bestCrowd: row.bestCrowd,
    });
  }
  return out;
}
