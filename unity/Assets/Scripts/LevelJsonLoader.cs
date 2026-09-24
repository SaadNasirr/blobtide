using System.IO;
using UnityEngine;

namespace Blobtide
{
    public static class LevelJsonLoader
    {
        public static LevelFile Load()
        {
            var path = Path.Combine(Application.streamingAssetsPath, "levels.json");
#if UNITY_ANDROID && !UNITY_EDITOR
            var req = new UnityEngine.Networking.UnityWebRequest(path);
            req.downloadHandler = new UnityEngine.Networking.DownloadHandlerBuffer();
            req.SendWebRequest();
            while (!req.isDone) { }
            return JsonUtility.FromJson<LevelFile>(req.downloadHandler.text);
#else
            var json = File.ReadAllText(path);
            return JsonUtility.FromJson<LevelFile>(Wrap(json));
#endif
        }

        static string Wrap(string json)
        {
            // Unity JsonUtility needs a root object; file already has { version, levels }
            return json;
        }
    }
}
