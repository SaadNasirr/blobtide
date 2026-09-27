/**
 * Optional CrazyGames SDK v3 bridge. Assigns window.BlobtidePlatform when the SDK loads.
 * GitHub Pages and local play still work if the script is missing or init fails.
 */
const AD_WAIT_MS = 8000;

export function muteAudioFromSearch(search = "") {
  try {
    const q = new URLSearchParams(String(search).replace(/^\?/, ""));
    return q.get("muteAudio") === "true";
  } catch {
    return false;
  }
}

export function isCrazyGamesHost() {
  try {
    const host = globalThis.location?.hostname || "";
    const ref = globalThis.document?.referrer || "";
    return /crazygames/i.test(host) || /crazygames/i.test(ref);
  } catch {
    return false;
  }
}

function sdkRoot() {
  return globalThis.window?.CrazyGames?.SDK;
}

function requestAd(sdk, type, hooks = {}) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      resolve(ok);
    };
    const timer = setTimeout(() => finish(false), AD_WAIT_MS);
    try {
      sdk.ad.requestAd(type, {
        adStarted() {
          hooks.started?.();
        },
        adFinished() {
          clearTimeout(timer);
          hooks.ended?.();
          finish(true);
        },
        adError() {
          clearTimeout(timer);
          hooks.ended?.();
          finish(false);
        },
      });
    } catch {
      clearTimeout(timer);
      hooks.ended?.();
      finish(false);
    }
  });
}

function sdkGame() {
  return globalThis.window?.CrazyGames?.SDK?.game;
}

export function crazyGamesLoadingStart() {
  try {
    sdkGame()?.loadingStart?.();
  } catch {
    /* ignore */
  }
}

export function crazyGamesLoadingStop() {
  try {
    sdkGame()?.loadingStop?.();
  } catch {
    /* ignore */
  }
}

function loadCrazyGamesSdk() {
  const src = "https://sdk.crazygames.com/crazygames-sdk-v3.js";
  return new Promise((resolve) => {
    if (globalThis.window?.CrazyGames?.SDK) {
      resolve(true);
      return;
    }
    if (typeof document === "undefined") {
      resolve(false);
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(!!globalThis.window?.CrazyGames?.SDK));
      existing.addEventListener("error", () => resolve(false));
      setTimeout(() => resolve(!!globalThis.window?.CrazyGames?.SDK), 3000);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(!!globalThis.window?.CrazyGames?.SDK);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
    setTimeout(() => resolve(!!globalThis.window?.CrazyGames?.SDK), 4000);
  });
}

export async function installCrazyGamesPlatform() {
  await loadCrazyGamesSdk();
  const sdk = sdkRoot();
  if (!sdk || typeof sdk.init !== "function") return false;
  crazyGamesLoadingStart();
  try {
    await Promise.race([
      sdk.init(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("sdk timeout")), 4000)),
    ]);
  } catch {
    crazyGamesLoadingStop();
    return false;
  }

  const platform = {
    adsLive: false,
    muteForced: muteAudioFromSearch(globalThis.location?.search) || !!sdk.game?.settings?.muteAudio,
    gameplayStart() {
      try {
        sdk.game.gameplayStart();
      } catch {
        /* ignore */
      }
    },
    gameplayStop() {
      try {
        sdk.game.gameplayStop();
      } catch {
        /* ignore */
      }
    },
    happyTime() {
      try {
        const fn = sdk.game.happytime || sdk.game.happyTime;
        fn?.call(sdk.game);
      } catch {
        /* ignore */
      }
    },
    async commercialBreak() {
      return requestAd(sdk, "midgame", {
        started: () => platform.onAdStart?.(),
        ended: () => platform.onAdEnd?.(),
      });
    },
    async rewardedBreak() {
      if (!platform.adsLive) return false;
      return requestAd(sdk, "rewarded", {
        started: () => platform.onAdStart?.(),
        ended: () => platform.onAdEnd?.(),
      });
    },
  };

  const syncMute = () => {
    platform.muteForced = muteAudioFromSearch(globalThis.location?.search) || !!sdk.game?.settings?.muteAudio;
    platform.onMuteAudio?.(platform.muteForced);
  };
  syncMute();
  platform._muteWatch = setInterval(syncMute, 2000);

  globalThis.window.BlobtidePlatform = platform;
  return true;
}
