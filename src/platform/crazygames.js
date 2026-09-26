/**
 * Optional CrazyGames SDK v3 bridge. Assigns window.BlobtidePlatform when the SDK loads.
 * GitHub Pages and local play still work if the script is missing or init fails.
 */
function requestAd(sdk, type) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      resolve(ok);
    };
    const timer = setTimeout(() => finish(false), 35000);
    try {
      sdk.ad.requestAd(type, {
        adStarted() {},
        adFinished() {
          clearTimeout(timer);
          finish(true);
        },
        adError() {
          clearTimeout(timer);
          finish(false);
        },
      });
    } catch {
      clearTimeout(timer);
      finish(false);
    }
  });
}

export async function installCrazyGamesPlatform() {
  const sdk = globalThis.window?.CrazyGames?.SDK;
  if (!sdk || typeof sdk.init !== "function") return false;
  try {
    sdk.game?.loadingStart?.();
    await Promise.race([
      sdk.init(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("sdk timeout")), 4000)),
    ]);
    sdk.game?.loadingStop?.();
  } catch {
    try {
      sdk.game?.loadingStop?.();
    } catch {
      /* ignore */
    }
    return false;
  }

  globalThis.window.BlobtidePlatform = {
    gameplayStart() {
      sdk.game.gameplayStart();
    },
    gameplayStop() {
      sdk.game.gameplayStop();
    },
    happyTime() {
      const fn = sdk.game.happytime || sdk.game.happyTime;
      fn?.call(sdk.game);
    },
    async commercialBreak() {
      return requestAd(sdk, "midgame");
    },
    async rewardedBreak() {
      return requestAd(sdk, "rewarded");
    },
  };
  return true;
}
