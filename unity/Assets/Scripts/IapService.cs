using System.Threading.Tasks;
using UnityEngine;
#if UNITY_PURCHASING
using UnityEngine.Purchasing;
#endif

namespace Blobtide
{
    public class IapService : MonoBehaviour
    {
        public Economy Economy;
        public const string RemoveAdsSku = "remove_ads";
        public const string Coins200 = "coins_200";
        public const string Coins1000 = "coins_1000";
        public const string SkinPrism = "skin_prism";

        public async Task<bool> Buy(string sku)
        {
#if UNITY_PURCHASING
            await Task.Yield();
            return Apply(sku);
#else
            Debug.Log($"[IAP mock] {sku}");
            await Task.Delay(200);
            return Apply(sku);
#endif
        }

        bool Apply(string sku)
        {
            if (Economy == null) return false;
            switch (sku)
            {
                case RemoveAdsSku:
                    Economy.GrantRemoveAds();
                    return true;
                case Coins200:
                    Economy.AddCoins(200);
                    return true;
                case Coins1000:
                    Economy.AddCoins(1000);
                    return true;
                case SkinPrism:
                    if (!Economy.OwnedSkins.Contains("rainbow")) Economy.OwnedSkins.Add("rainbow");
                    Economy.Equipped = "rainbow";
                    Economy.Save();
                    return true;
            }
            return false;
        }
    }
}
