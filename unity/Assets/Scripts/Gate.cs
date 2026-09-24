using UnityEngine;

namespace Blobtide
{
    public class Gate : MonoBehaviour
    {
        public GateOp Op;
        public int Value = 2;
        public float X;
        public float Z;
        public float HalfWidth = 1.25f;
        public bool Used;

        public bool Contains(float crowdX) => Mathf.Abs(crowdX - X) <= HalfWidth;

        public int Apply(int count) => GateMath.Apply(Op, count, Value);
    }
}
