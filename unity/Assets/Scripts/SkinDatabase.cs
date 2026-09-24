using UnityEngine;

namespace Blobtide
{
    [CreateAssetMenu(menuName = "Blobtide/Skin Database")]
    public class SkinDatabase : ScriptableObject
    {
        public Skin[] Skins;

        [System.Serializable]
        public class Skin
        {
            public string Id;
            public string Name;
            public int Price;
            public bool Iap;
            public Color Color = Color.green;
        }
    }
}
