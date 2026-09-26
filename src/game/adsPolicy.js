import { CONFIG } from "../config.js";

/**
 * Interstitial rules for a hypercasual runner (Play / AdMob policy-friendly):
 * never during play, never on fail, never in the first two real levels,
 * cap to every N wins, and a wall-clock cooldown so binge sessions are not a wall of ads.
 */
export function shouldShowInterstitial({
  adsRemoved,
  winsSinceAd,
  levelIndex,
  lastShownAt = 0,
  now = Date.now(),
  tutorialActive = false,
} = {}) {
  if (adsRemoved) return false;
  if (tutorialActive) return false;
  const level = Math.max(0, Math.floor(Number(levelIndex) || 0));
  if (level < CONFIG.ads.minLevelForInterstitial) return false;
  const wins = Math.max(0, Math.floor(Number(winsSinceAd) || 0));
  if (wins < CONFIG.ads.interstitialEveryWins) return false;
  if (now - lastShownAt < CONFIG.ads.minMsBetweenInterstitials) return false;
  return true;
}
