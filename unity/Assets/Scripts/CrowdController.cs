using UnityEngine;

namespace Blobtide
{
    public class CrowdController : MonoBehaviour
    {
        public int Count { get; private set; }
        public float LaneLimit = 3.15f;
        public float Speed = 7.2f;
        public Transform VisualRoot;
        public int MaxVisible = 80;

        float _x;
        float _targetX;
        float _z;

        public Vector3 Position => new(_x, 0f, _z);

        public void ResetCrowd(int count)
        {
            Count = Mathf.Max(0, count);
            _x = 0f;
            _z = 0f;
            _targetX = 0f;
            Rebuild();
        }

        public void SetTargetX(float x) => _targetX = Mathf.Clamp(x, -LaneLimit, LaneLimit);

        public void SetCount(int n)
        {
            Count = Mathf.Max(0, n);
            Rebuild();
        }

        void Rebuild()
        {
            if (!VisualRoot) return;
            int shown = Mathf.Clamp(Count, 0, MaxVisible);
            for (int i = 0; i < VisualRoot.childCount; i++)
                VisualRoot.GetChild(i).gameObject.SetActive(i < shown);
        }

        public void NudgeZ(float z) => _z = z;

        public void Tick(float dt)
        {
            _x = Mathf.Lerp(_x, _targetX, Mathf.Min(1f, dt * 12f));
            _z += Speed * dt;
            transform.position = new Vector3(_x, 0f, _z);
        }
    }
}
