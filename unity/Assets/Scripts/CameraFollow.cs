using UnityEngine;

namespace Blobtide
{
    public class CameraFollow : MonoBehaviour
    {
        public Transform Target;
        public Vector3 Offset = new(0f, 5.4f, -8.2f);
        public float Shake;

        public void Punch(float amount) => Shake = Mathf.Max(Shake, amount);

        void LateUpdate()
        {
            if (!Target) return;
            Vector3 punch = Vector3.zero;
            if (Shake > 0.002f)
            {
                punch = Random.insideUnitSphere * Shake;
                punch.z = 0f;
                Shake *= 0.86f;
            }
            Vector3 p = Target.position;
            transform.position = new Vector3(p.x * 0.35f, 0f, p.z) + Offset + punch;
            transform.LookAt(new Vector3(p.x * 0.2f, 0.6f, p.z + 4.5f));
        }
    }
}
