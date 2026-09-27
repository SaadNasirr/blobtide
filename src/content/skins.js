export const SKINS = [
  { id: "lime", name: "Tide", price: 0, color: 0x2ec8d4, emissive: 0x148a98, group: "paint" },
  { id: "cyan", name: "Sky", price: 50, color: 0x4ab4ff, emissive: 0x1a78c8, group: "paint" },
  { id: "magenta", name: "Berry", price: 100, color: 0xff5a8a, emissive: 0xc02050, group: "paint" },
  { id: "lemon", name: "Lemon", price: 140, color: 0xfff06a, emissive: 0xc8a818, group: "paint" },
  { id: "grape", name: "Grape", price: 160, color: 0xa45cff, emissive: 0x5a20b8, group: "paint" },
  { id: "gold", name: "Sun Gold", price: 250, color: 0xffd166, emissive: 0xe09a20, group: "paint" },
  { id: "ice", name: "Ice", price: 250, color: 0xd0f0ff, emissive: 0x7ab8d8, group: "paint" },
  { id: "honey", name: "Honey", price: 300, color: 0xffc857, emissive: 0xd49018, group: "paint" },
  { id: "mint", name: "Mint", price: 350, color: 0x5edc9a, emissive: 0x28a868, group: "paint" },
  { id: "ember", name: "Ember", price: 400, color: 0xff6b35, emissive: 0xc83810, group: "paint" },
  { id: "void", name: "Night", price: 600, color: 0x3a5a88, emissive: 0x1a3058, group: "paint", metal: 0.45, rough: 0.28 },
  { id: "ink", name: "Ink", price: 650, color: 0x1a1a28, emissive: 0x3a2060, group: "paint", metal: 0.55, rough: 0.22 },

  { id: "bee", name: "Bumble", price: 180, color: 0xffd24a, emissive: 0xc89010, stripe: 0x1a1408, pattern: "stripes", hat: "antenna", group: "look" },
  { id: "tiger", name: "Tiger", price: 220, color: 0xff8a2a, emissive: 0xc84808, stripe: 0x2a1208, pattern: "stripes", group: "look" },
  { id: "melon", name: "Melon", price: 240, color: 0x4ad66a, emissive: 0x1a8838, stripe: 0xff6a88, pattern: "spots", group: "look" },
  { id: "candy", name: "Candy", price: 280, color: 0xff7ab8, emissive: 0xd04078, stripe: 0xffffff, pattern: "stripes", group: "look" },
  { id: "bubble", name: "Bubble", price: 320, color: 0xff9ad8, emissive: 0xff66aa, pattern: "sparkle", hat: "bow", group: "look" },
  { id: "ocean", name: "Ocean", price: 340, color: 0x1a88d8, emissive: 0x0a50a0, pattern: "sparkle", group: "look" },
  { id: "cat", name: "Kitty", price: 360, color: 0xffb07a, emissive: 0xc86838, hat: "ears", group: "look" },
  { id: "moss", name: "Moss", price: 380, color: 0x3a8848, emissive: 0x1a5028, pattern: "spots", group: "look" },
  { id: "robot", name: "Bolt", price: 420, color: 0x8aa0b8, emissive: 0x3a88c8, pattern: "grid", hat: "antenna", metal: 0.82, rough: 0.22, group: "look" },
  { id: "alien", name: "Alien", price: 440, color: 0x7cff4a, emissive: 0x38a018, hat: "antenna", group: "look" },
  { id: "lava", name: "Magma", price: 480, color: 0xff3a18, emissive: 0xff8010, pattern: "lava", metal: 0.35, rough: 0.38, group: "look" },
  { id: "ghost", name: "Ghost", price: 500, color: 0xe8f0ff, emissive: 0x88a0d0, hat: "halo", rough: 0.18, metal: 0.12, group: "look" },
  { id: "devil", name: "Imp", price: 520, color: 0xc01828, emissive: 0x881010, hat: "horns", group: "look" },
  { id: "royal", name: "Royal", price: 700, color: 0x6a40e8, emissive: 0xffc45a, hat: "crown", metal: 0.4, group: "look" },

  { id: "reef", name: "Reef", price: 0, color: 0x3cffc2, emissive: 0x14a878, starLock: "reef", group: "star" },
  { id: "dusk", name: "Dusk Tide", price: 0, color: 0x7a5cff, emissive: 0x3a28a0, starLock: "dusk", group: "star" },
  { id: "prestige", name: "Prestige", price: 0, color: 0xfff4d2, emissive: 0xffc45a, starLock: "prestige", prestige: true, hat: "crown", metal: 0.5, group: "star" },
  { id: "rainbow", name: "Prism", price: 1200, color: 0xffffff, emissive: 0xff66cc, iap: true, pattern: "sparkle", group: "iap" },
];

export const SKIN_GROUPS = [
  { id: "look", title: "Looks" },
  { id: "paint", title: "Paints" },
  { id: "star", title: "Star drops" },
  { id: "iap", title: "Special" },
];

/** Replay targets: 1★ on 5, 2★ on 8, 3★ on every level 1–10. */
export const STAR_UNLOCKS = {
  reef: { minStars: 1, levelId: 5, hint: "1★ on level 5" },
  dusk: { minStars: 2, levelId: 8, hint: "2★ on level 8" },
  prestige: { minStars: 3, from: 1, to: 10, hint: "3★ on levels 1–10" },
};

export function starsOnLevel(stats, levelId) {
  const row = stats?.[levelId - 1] ?? stats?.[String(levelId - 1)];
  return Math.max(0, Math.min(3, row?.stars | 0));
}

export function starSkinsDue(stats = {}) {
  const due = [];
  if (starsOnLevel(stats, STAR_UNLOCKS.reef.levelId) >= STAR_UNLOCKS.reef.minStars) due.push("reef");
  if (starsOnLevel(stats, STAR_UNLOCKS.dusk.levelId) >= STAR_UNLOCKS.dusk.minStars) due.push("dusk");
  let sweep = true;
  for (let id = STAR_UNLOCKS.prestige.from; id <= STAR_UNLOCKS.prestige.to; id++) {
    if (starsOnLevel(stats, id) < STAR_UNLOCKS.prestige.minStars) {
      sweep = false;
      break;
    }
  }
  if (sweep) due.push("prestige");
  return due;
}

export function nextStarSkinGoal(stats, ownedSkins) {
  const have = new Set(ownedSkins || []);
  if (!have.has("reef")) {
    const s = starsOnLevel(stats, 5);
    return { id: "reef", name: "Reef", need: Math.max(0, 1 - s), hint: "1★ on level 5" };
  }
  if (!have.has("dusk")) {
    const s = starsOnLevel(stats, 8);
    return { id: "dusk", name: "Dusk Tide", need: Math.max(0, 2 - s), hint: "2★ on level 8" };
  }
  if (!have.has("prestige")) {
    let missing = 0;
    for (let id = 1; id <= 10; id++) missing += Math.max(0, 3 - starsOnLevel(stats, id));
    return { id: "prestige", name: "Prestige", need: missing, hint: `${missing} more stars on levels 1–10` };
  }
  return null;
}

export function getSkin(id) {
  return SKINS.find((s) => s.id === id) || SKINS[0];
}

export function skinPreviewStyle(skin) {
  const a = `#${(skin.color >>> 0).toString(16).padStart(6, "0")}`;
  const b = `#${((skin.stripe || skin.emissive || skin.color) >>> 0).toString(16).padStart(6, "0")}`;
  if (skin.pattern === "stripes") return `repeating-linear-gradient(125deg, ${a} 0 10px, ${b} 10px 18px)`;
  if (skin.pattern === "spots") return `radial-gradient(circle at 30% 30%, ${b} 0 18%, ${a} 19% 100%)`;
  if (skin.pattern === "sparkle") return `radial-gradient(circle at 30% 28%, #fff 0 8%, ${a} 32%, ${b} 100%)`;
  if (skin.pattern === "grid") return `repeating-linear-gradient(0deg, ${b} 0 3px, ${a} 3px 14px)`;
  if (skin.pattern === "lava") return `linear-gradient(135deg, #ff8010, ${a} 45%, #4a0808)`;
  if (skin.iap) return `conic-gradient(#ff66cc, #66f0ff, #ffe566, #ff66cc)`;
  return `radial-gradient(circle at 32% 28%, #fff8, ${a} 42%, ${b})`;
}
