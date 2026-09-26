/**
 * HTML5 portal hook. CrazyGames / Poki SDKs assign window.BlobtidePlatform.
 * Core game never imports those SDKs.
 */
async function call(name, ...args) {
  const sdk = globalThis.window?.BlobtidePlatform;
  const fn = sdk?.[name];
  if (typeof fn !== "function") return undefined;
  return fn(...args);
}

export const Platform = {
  async gameplayStart() {
    await call("gameplayStart");
  },
  async gameplayStop() {
    await call("gameplayStop");
  },
  async commercialBreak() {
    const shown = await call("commercialBreak");
    return shown !== false;
  },
  async rewardedBreak() {
    const ok = await call("rewardedBreak");
    return ok === true;
  },
  happyTime() {
    call("happyTime");
  },
  openExternalLink(url) {
    call("openExternalLink", url);
  },
  has(name) {
    return typeof globalThis.window?.BlobtidePlatform?.[name] === "function";
  },
};
