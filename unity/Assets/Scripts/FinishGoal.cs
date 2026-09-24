using UnityEngine;

namespace Blobtide
{
    public class FinishGoal : MonoBehaviour
    {
        public int Hp = 10;
        public float Z;
        public bool Used;

        public bool Beats(int count) => count >= Hp;
    }
}
