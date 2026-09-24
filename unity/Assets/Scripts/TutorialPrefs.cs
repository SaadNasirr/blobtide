using UnityEngine;

namespace Blobtide
{
    /// <summary>
    /// Mirrors the web tutorial persistence so a later Unity UI can use the same rules.
    /// </summary>
    public static class TutorialPrefs
    {
        const string Prefix = "blobtide_tutorial_";

        public static int SessionsStarted
        {
            get => PlayerPrefs.GetInt(Prefix + "sessions", 0);
            set => PlayerPrefs.SetInt(Prefix + "sessions", value);
        }

        public static bool Skipped
        {
            get => PlayerPrefs.GetInt(Prefix + "skipped", 0) == 1;
            set => PlayerPrefs.SetInt(Prefix + "skipped", value ? 1 : 0);
        }

        public static bool HideInstructions
        {
            get => PlayerPrefs.GetInt(Prefix + "hide", 0) == 1;
            set => PlayerPrefs.SetInt(Prefix + "hide", value ? 1 : 0);
        }

        public static string DecideMode(bool replay)
        {
            if (HideInstructions && !replay) return "none";
            if (replay) return "full";
            if (Skipped) return "none";
            if (SessionsStarted <= 0) return "full";
            if (SessionsStarted == 1) return "refresher";
            return "none";
        }

        public static string BeginPlay(bool replay)
        {
            var mode = DecideMode(replay);
            if (!replay && (mode == "full" || mode == "refresher"))
                SessionsStarted = Mathf.Min(2, SessionsStarted + 1);
            if (replay) HideInstructions = false;
            PlayerPrefs.Save();
            return mode;
        }
    }
}
