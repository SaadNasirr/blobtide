using System.Collections.Generic;
using UnityEngine;

namespace Blobtide
{
    public class Economy : MonoBehaviour
    {
        public int Coins;
        public string Equipped = "lime";
        public bool RemoveAds;
        public int LevelIndex;
        public int MaxUnlocked;
        public int WinsSinceAd;
        public List<string> OwnedSkins = new() { "lime" };

        const string Key = "blobtide_save";

        public void Load()
        {
            if (!PlayerPrefs.HasKey(Key)) return;
            var json = PlayerPrefs.GetString(Key);
            JsonUtility.FromJsonOverwrite(json, this);
            if (!OwnedSkins.Contains("lime")) OwnedSkins.Insert(0, "lime");
        }

        public void Save()
        {
            PlayerPrefs.SetString(Key, JsonUtility.ToJson(this));
            PlayerPrefs.Save();
        }

        public void AddCoins(int n)
        {
            Coins += Mathf.Max(0, n);
            Save();
        }

        public bool BuySkin(string id, int price)
        {
            if (OwnedSkins.Contains(id)) return true;
            if (Coins < price) return false;
            Coins -= price;
            OwnedSkins.Add(id);
            Equipped = id;
            Save();
            return true;
        }

        public bool CampaignComplete;

        public void OnWin(int levelIndex, int lastIndex)
        {
            CampaignComplete = levelIndex >= lastIndex;
            LevelIndex = CampaignComplete ? lastIndex : levelIndex + 1;
            MaxUnlocked = Mathf.Max(MaxUnlocked, LevelIndex);
            WinsSinceAd++;
            Save();
        }

        public void GrantRemoveAds()
        {
            RemoveAds = true;
            Save();
        }
    }
}
