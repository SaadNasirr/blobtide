using UnityEngine;

namespace Blobtide
{
    public class AnalyticsService : MonoBehaviour
    {
        public void Event(string name, string key = null, object value = null)
        {
            if (string.IsNullOrEmpty(key))
                Debug.Log($"[analytics] {name}");
            else
                Debug.Log($"[analytics] {name} {key}={value}");
#if FIREBASE_ANALYTICS
            // Firebase.Analytics.FirebaseAnalytics.LogEvent(name);
#endif
        }
    }

    public class ConsentService : MonoBehaviour
    {
        public async System.Threading.Tasks.Task RequestAsync()
        {
            await System.Threading.Tasks.Task.Yield();
#if UNITY_IOS && !UNITY_EDITOR
            // ATTrackingStatusBinding.RequestAuthorizationTracking();
#endif
            // Google UMP ConsentForm.LoadAndShowConsentFormIfRequired
            Debug.Log("[consent] requested ATT/UMP (wire SDKs before production ads)");
        }
    }

    public class CrashReporting
    {
        public static void Init()
        {
#if FIREBASE_CRASHLYTICS
            // Firebase.Crashlytics.Crashlytics.IsCrashlyticsCollectionEnabled = true;
#endif
            Application.logMessageReceived += (c, s, t) =>
            {
                if (t == LogType.Exception) Debug.LogWarning($"[crash] {c}");
            };
        }
    }
}
