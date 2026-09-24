using UnityEngine;

namespace Blobtide
{
    public enum GateOp { Add, Sub, Mul, Div }

    public static class GateMath
    {
        public static int Apply(GateOp op, int count, int value)
        {
            value = Mathf.Max(1, value);
            count = Mathf.Max(0, count);
            switch (op)
            {
                case GateOp.Add: return Mathf.Min(count + value, 99999);
                case GateOp.Sub: return Mathf.Max(0, count - value);
                case GateOp.Mul: return Mathf.Min(count * value, 99999);
                case GateOp.Div: return count / value;
                default: return count;
            }
        }

        public static string Label(GateOp op, int value)
        {
            return op switch
            {
                GateOp.Add => $"+{value}",
                GateOp.Sub => $"-{value}",
                GateOp.Mul => $"x{value}",
                GateOp.Div => $"÷{value}",
                _ => "?"
            };
        }

        public static GateOp Parse(string op)
        {
            return op switch
            {
                "sub" => GateOp.Sub,
                "mul" => GateOp.Mul,
                "div" => GateOp.Div,
                _ => GateOp.Add
            };
        }
    }
}
