using System;
using System.Threading.Tasks;
using UnityEngine;

namespace Blobtide
{
    /// <summary>
    /// Editor/web mock by default. Enable GOOGLE_MOBILE_ADS after importing the AdMob Unity package
    /// and paste real ad unit IDs in the inspector.
    /// </summary>
    public class AdsService : MonoBehaviour
    {
        public string AndroidRewardedId = "ca-app-pub-3940256099942544/5224354917";
        public string IosRewardedId = "ca-app-pub-3940256099942544/1712485313";
        public string AndroidInterstitialId = "ca-app-pub-3940256099942544/1033173712";
        public string IosInterstitialId = "ca-app-pub-3940256099942544/4411468910";
        public Economy Economy;

        public bool AdsEnabled => Economy == null || !Economy.RemoveAds;

        public async Task<bool> ShowRewarded(string reason)
        {
#if GOOGLE_MOBILE_ADS
            return await ShowRewardedAdMob(reason);
#else
            Debug.Log($"[Ads mock] rewarded for {reason}");
            await Task.Delay(1200);
            return true;
#endif
        }

        public async Task<bool> MaybeInterstitial()
        {
            if (!AdsEnabled) return false;
            if (Economy != null && Economy.WinsSinceAd < 3) return false;
#if GOOGLE_MOBILE_ADS
            var shown = await ShowInterstitialAdMob();
#else
            Debug.Log("[Ads mock] interstitial");
            await Task.Delay(1000);
            var shown = true;
#endif
            if (shown && Economy != null)
            {
                Economy.WinsSinceAd = 0;
                Economy.Save();
            }
            return shown;
        }

#if GOOGLE_MOBILE_ADS
        async Task<bool> ShowRewardedAdMob(string reason)
        {
            await Task.Yield();
            return true;
        }

        async Task<bool> ShowInterstitialAdMob()
        {
            await Task.Yield();
            return true;
        }
#endif
    }
}
