using UnityEngine;

namespace Blobtide
{
    public enum HazardKind { Saw, Hole, Wall }

    public class Hazard : MonoBehaviour
    {
        public HazardKind Kind;
        public float X;
        public float Z;
        public float Width = 1.4f;
        public int Damage = 3;
        public bool Used;

        public bool Hits(float crowdX)
        {
            float extra = Kind == HazardKind.Hole ? 0f : 0.35f;
            return Mathf.Abs(crowdX - X) <= Width * 0.55f + extra;
        }

        public int Apply(int count)
        {
            if (Kind == HazardKind.Hole)
                return count - Mathf.Max(2, Mathf.FloorToInt(count * 0.3f));
            return count - Damage;
        }
    }
}
