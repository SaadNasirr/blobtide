using System;
using System.Collections.Generic;
using UnityEngine;

namespace Blobtide
{
    [Serializable]
    public class LevelOp
    {
        public string op;
        public int value;
    }

    [Serializable]
    public class LevelPiece
    {
        public float z;
        public string type;
        public string op;
        public int value;
        public float x;
        public float width = 1.4f;
        public int damage = 3;
        public int hp;
        public LevelOp left;
        public LevelOp right;
    }

    [Serializable]
    public class LevelDefinition
    {
        public int id;
        public int startCount;
        public List<LevelPiece> pieces = new();
    }

    [Serializable]
    public class LevelFile
    {
        public int version;
        public List<LevelDefinition> levels = new();
    }
}
