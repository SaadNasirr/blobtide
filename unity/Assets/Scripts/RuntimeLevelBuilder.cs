using UnityEngine;

namespace Blobtide
{
    public class RuntimeLevelBuilder : MonoBehaviour
    {
        public Transform TrackRoot;

        public float Build(LevelDefinition level)
        {
            if (TrackRoot)
            {
                for (int i = TrackRoot.childCount - 1; i >= 0; i--)
                    Destroy(TrackRoot.GetChild(i).gameObject);
            }
            else
            {
                var go = new GameObject("Track");
                TrackRoot = go.transform;
            }

            float finishZ = 40f;
            foreach (var p in level.pieces)
            {
                if (p.type == "gate") SpawnGate(p.z, p.x, GateMath.Parse(p.op), p.value);
                else if (p.type == "dualgate" && p.left != null && p.right != null)
                {
                    SpawnGate(p.z, -1.45f, GateMath.Parse(p.left.op), p.left.value);
                    SpawnGate(p.z, 1.45f, GateMath.Parse(p.right.op), p.right.value);
                }
                else if (p.type == "saw") SpawnHazard(p, HazardKind.Saw);
                else if (p.type == "hole") SpawnHazard(p, HazardKind.Hole);
                else if (p.type == "wall") SpawnHazard(p, HazardKind.Wall);
                else if (p.type == "finish")
                {
                    finishZ = p.z;
                    var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    go.name = "Finish";
                    go.transform.SetParent(TrackRoot);
                    go.transform.position = new Vector3(0f, 1.2f, p.z);
                    go.transform.localScale = new Vector3(7.6f, 2.4f, 0.45f);
                    var f = go.AddComponent<FinishGoal>();
                    f.Hp = p.hp;
                    f.Z = p.z;
                }
            }
            return finishZ;
        }

        void SpawnGate(float z, float x, GateOp op, int value)
        {
            var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
            go.name = $"Gate_{GateMath.Label(op, value)}";
            go.transform.SetParent(TrackRoot);
            go.transform.position = new Vector3(x, 0.85f, z);
            go.transform.localScale = new Vector3(2.2f, 1.6f, 0.28f);
            var g = go.AddComponent<Gate>();
            g.Op = op;
            g.Value = value;
            g.X = x;
            g.Z = z;
        }

        void SpawnHazard(LevelPiece p, HazardKind kind)
        {
            var go = GameObject.CreatePrimitive(kind == HazardKind.Hole ? PrimitiveType.Cube : PrimitiveType.Cylinder);
            go.name = kind.ToString();
            go.transform.SetParent(TrackRoot);
            go.transform.position = new Vector3(p.x, 0.4f, p.z);
            var h = go.AddComponent<Hazard>();
            h.Kind = kind;
            h.X = p.x;
            h.Z = p.z;
            h.Width = p.width;
            h.Damage = p.damage;
        }
    }
}
