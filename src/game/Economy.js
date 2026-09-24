const PREFIX = "blobtide_";
export const LAST_LEVEL_INDEX = 55;

export function progressAfterWin(levelIndex, lastIndex = LAST_LEVEL_INDEX) {
  const i = Math.max(0, Math.floor(levelIndex));
  if (i >= lastIndex) {
    return { levelIndex: lastIndex, campaignComplete: true };
  }
  return { levelIndex: i + 1, campaignComplete: false };
}

export const Economy = {
  coins: 0,
  ownedSkins: ["lime"],
  equipped: "lime",
  removeAds: false,
  levelIndex: 0,
  maxUnlocked: 0,
  winsSinceAd: 0,
  campaignComplete: false,

  load() {
    try {
      const raw = localStorage.getItem(PREFIX + "save");
      if (!raw) return this;
      const data = JSON.parse(raw);
      Object.assign(this, data);
      if (!this.ownedSkins?.includes("lime")) this.ownedSkins.unshift("lime");
      this.levelIndex = Math.max(0, Math.min(LAST_LEVEL_INDEX, Number(this.levelIndex) || 0));
      this.campaignComplete = !!this.campaignComplete;
    } catch {
      /* keep defaults */
    }
    return this;
  },

  save() {
    localStorage.setItem(
      PREFIX + "save",
      JSON.stringify({
        coins: this.coins,
        ownedSkins: this.ownedSkins,
        equipped: this.equipped,
        removeAds: this.removeAds,
        levelIndex: this.levelIndex,
        maxUnlocked: this.maxUnlocked,
        winsSinceAd: this.winsSinceAd,
        campaignComplete: this.campaignComplete,
      })
    );
  },

  addCoins(n) {
    this.coins += Math.max(0, Math.floor(n));
    this.save();
  },

  buySkin(id, price) {
    if (this.ownedSkins.includes(id)) return true;
    if (this.coins < price) return false;
    this.coins -= price;
    this.ownedSkins.push(id);
    this.equipped = id;
    this.save();
    return true;
  },

  equip(id) {
    if (!this.ownedSkins.includes(id)) return false;
    this.equipped = id;
    this.save();
    return true;
  },

  onWin(levelIndex) {
    const next = progressAfterWin(levelIndex, LAST_LEVEL_INDEX);
    this.levelIndex = next.levelIndex;
    this.campaignComplete = next.campaignComplete;
    this.maxUnlocked = Math.max(this.maxUnlocked, this.levelIndex);
    this.winsSinceAd += 1;
    this.save();
    return next;
  },

  beginNewRun() {
    this.campaignComplete = false;
    this.levelIndex = 0;
    this.save();
  },

  grantRemoveAds() {
    this.removeAds = true;
    this.save();
  },
};
