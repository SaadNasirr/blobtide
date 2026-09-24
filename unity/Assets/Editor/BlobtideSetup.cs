using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEditor.SceneManagement;

namespace Blobtide.Editor
{
    public static class BlobtideSetup
    {
        [MenuItem("Blobtide/Create Game Scene")]
        public static void CreateScene()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var camGo = new GameObject("Main Camera");
            var cam = camGo.AddComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.03f, 0.02f, 0.05f);
            cam.fieldOfView = 52f;
            camGo.tag = "MainCamera";
            camGo.AddComponent<AudioListener>();
            camGo.AddComponent<Blobtide.CameraFollow>();

            var light = new GameObject("Key Light");
            var dl = light.AddComponent<Light>();
            dl.type = LightType.Directional;
            dl.intensity = 1.1f;
            light.transform.rotation = Quaternion.Euler(50f, -30f, 0f);

            var crowd = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            crowd.name = "Crowd";
            var vis = new GameObject("Visuals");
            vis.transform.SetParent(crowd.transform);
            for (int i = 0; i < 80; i++)
            {
                var b = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                b.transform.SetParent(vis.transform);
                float a = i * 2.399963f;
                float r = 0.2f * Mathf.Sqrt(i);
                b.transform.localPosition = new Vector3(Mathf.Cos(a) * r, 0.22f, Mathf.Sin(a) * r * 0.85f);
                b.transform.localScale = Vector3.one * 0.4f;
            }
            var cc = crowd.AddComponent<Blobtide.CrowdController>();
            cc.VisualRoot = vis.transform;

            var gm = new GameObject("GameManager");
            var manager = gm.AddComponent<Blobtide.GameManager>();
            manager.Crowd = cc;
            manager.CameraFollow = camGo.GetComponent<Blobtide.CameraFollow>();
            manager.Economy = gm.AddComponent<Blobtide.Economy>();
            manager.Ads = gm.AddComponent<Blobtide.AdsService>();
            manager.Iap = gm.AddComponent<Blobtide.IapService>();
            manager.Analytics = gm.AddComponent<Blobtide.AnalyticsService>();
            manager.Consent = gm.AddComponent<Blobtide.ConsentService>();
            manager.Builder = gm.AddComponent<Blobtide.RuntimeLevelBuilder>();
            manager.CameraFollow.Target = crowd.transform;

            System.IO.Directory.CreateDirectory("Assets/Scenes");
            EditorSceneManager.SaveScene(scene, "Assets/Scenes/Game.unity");
            var list = new[] { new EditorBuildSettingsScene("Assets/Scenes/Game.unity", true) };
            EditorBuildSettings.scenes = list;
            Debug.Log("Blobtide scene created at Assets/Scenes/Game.unity");
        }

        [MenuItem("Blobtide/Apply Mobile Player Settings")]
        public static void Player()
        {
            PlayerSettings.companyName = "Blobtide";
            PlayerSettings.productName = "Blobtide";
            PlayerSettings.bundleVersion = "1.0.0";
            PlayerSettings.SetApplicationIdentifier(BuildTargetGroup.Android, "com.blobtide.game");
            PlayerSettings.SetApplicationIdentifier(BuildTargetGroup.iOS, "com.blobtide.game");
            PlayerSettings.defaultInterfaceOrientation = UIOrientation.Portrait;
            PlayerSettings.allowedAutorotateToPortrait = true;
            PlayerSettings.allowedAutorotateToPortraitUpsideDown = false;
            PlayerSettings.allowedAutorotateToLandscapeLeft = false;
            PlayerSettings.allowedAutorotateToLandscapeRight = false;
            PlayerSettings.Android.minSdkVersion = AndroidSdkVersions.AndroidApiLevel24;
            PlayerSettings.Android.targetSdkVersion = AndroidSdkVersions.AndroidApiLevelAuto;
            PlayerSettings.SetScriptingBackend(BuildTargetGroup.Android, ScriptingImplementation.IL2CPP);
            PlayerSettings.Android.targetArchitectures = AndroidArchitecture.ARM64;
            Debug.Log("Player settings applied for portrait Android/iOS.");
        }

        [MenuItem("Blobtide/Build Android AAB (release)")]
        public static void BuildAndroid()
        {
            Player();
            PlayerSettings.Android.useAPKExpansionFiles = false;
            EditorUserBuildSettings.buildAppBundle = true;
            EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.Android, BuildTarget.Android);
            var opts = new BuildPlayerOptions
            {
                scenes = new[] { "Assets/Scenes/Game.unity" },
                locationPathName = "Build/Android/Blobtide.aab",
                target = BuildTarget.Android,
                options = BuildOptions.None
            };
            var report = BuildPipeline.BuildPlayer(opts);
            Debug.Log(report.summary.result);
        }
    }
}
