using UnityEngine;

namespace Blobtide
{
    public class GameManager : MonoBehaviour
    {
        public CrowdController Crowd;
        public CameraFollow CameraFollow;
        public Economy Economy;
        public AdsService Ads;
        public IapService Iap;
        public AnalyticsService Analytics;
        public ConsentService Consent;
        public RuntimeLevelBuilder Builder;

        LevelFile _file;
        LevelDefinition _level;
        int _index;
        bool _ended;
        bool _paused;
        int _coinMultiplier = 1;
        public int LastReward { get; private set; }

        async void Start()
        {
            CrashReporting.Init();
            if (!Economy) Economy = gameObject.AddComponent<Economy>();
            if (!Ads) Ads = gameObject.AddComponent<AdsService>();
            if (!Iap) Iap = gameObject.AddComponent<IapService>();
            if (!Analytics) Analytics = gameObject.AddComponent<AnalyticsService>();
            if (!Consent) Consent = gameObject.AddComponent<ConsentService>();
            if (!Builder) Builder = gameObject.AddComponent<RuntimeLevelBuilder>();
            Ads.Economy = Economy;
            Iap.Economy = Economy;
            Economy.Load();
            await Consent.RequestAsync();
            _file = LevelJsonLoader.Load();
            Analytics.Event("boot");
            LoadLevel(Economy.LevelIndex);
        }

        void Update()
        {
            if (Crowd == null || _level == null) return;
            if (Input.GetKeyDown(KeyCode.P) || Input.GetKeyDown(KeyCode.Escape))
                _paused = !_paused;
            if (Input.GetKeyDown(KeyCode.R) && _ended)
                LoadLevel(_index);
            if (_paused || _ended) return;

            float axis = Input.GetAxisRaw("Horizontal");
            if (Mathf.Abs(axis) > 0.1f)
                Crowd.SetTargetX(axis * Crowd.LaneLimit);
            else if (Input.GetMouseButton(0) || Input.touchCount > 0)
            {
                float px = Input.touchCount > 0 ? Input.GetTouch(0).position.x : Input.mousePosition.x;
                float t = px / Screen.width;
                Crowd.SetTargetX(Mathf.Lerp(-Crowd.LaneLimit, Crowd.LaneLimit, t));
            }
            Crowd.Tick(Time.deltaTime);
            Collide();
        }

        public void LoadLevel(int index)
        {
            if (_file?.levels == null || _file.levels.Count == 0)
            {
                Debug.LogError("No levels.json in StreamingAssets");
                return;
            }
            _index = Mathf.Clamp(index, 0, _file.levels.Count - 1);
            _level = _file.levels[_index];
            _ended = false;
            _coinMultiplier = 1;
            Crowd.ResetCrowd(_level.startCount);
            Builder.Build(_level);
            if (CameraFollow) CameraFollow.Target = Crowd.transform;
            Analytics.Event("level_start", "level", _index + 1);
        }

        void Collide()
        {
            float z = Crowd.Position.z;
            float x = Crowd.Position.x;
            foreach (var gate in FindObjectsByType<Gate>(FindObjectsSortMode.None))
            {
                if (gate.Used || z < gate.Z - 0.55f || z > gate.Z + 0.7f) continue;
                if (!gate.Contains(x)) continue;
                gate.Used = true;
                Crowd.SetCount(gate.Apply(Crowd.Count));
                CameraFollow?.Punch(gate.Op == GateOp.Mul ? 0.28f : 0.16f);
                if (Crowd.Count <= 0) Fail("wiped");
            }
            foreach (var h in FindObjectsByType<Hazard>(FindObjectsSortMode.None))
            {
                if (h.Used || z < h.Z - 0.55f || z > h.Z + 0.7f) continue;
                if (!h.Hits(x)) continue;
                h.Used = true;
                Crowd.SetCount(h.Apply(Crowd.Count));
                CameraFollow?.Punch(0.3f);
                if (Crowd.Count <= 0) Fail("hazard");
            }
            foreach (var f in FindObjectsByType<FinishGoal>(FindObjectsSortMode.None))
            {
                if (f.Used || z < f.Z - 0.55f || z > f.Z + 0.7f) continue;
                f.Used = true;
                if (f.Beats(Crowd.Count)) Win(f.Hp);
                else Fail("door");
            }
        }

        void Win(int hp)
        {
            _ended = true;
            LastReward = Mathf.Max(8, 10 + Crowd.Count - hp + _index) * _coinMultiplier;
            Analytics.Event("level_win", "level", _index + 1);
        }

        void Fail(string reason)
        {
            _ended = true;
            Analytics.Event("level_fail", "reason", reason);
        }

        public async void CollectWinAndNext()
        {
            Economy.AddCoins(LastReward);
            Economy.OnWin(_index, _file.levels.Count - 1);
            await Ads.MaybeInterstitial();
            LoadLevel(Economy.LevelIndex);
        }

        public async void RewardedContinue()
        {
            if (!await Ads.ShowRewarded("crowd burst")) return;
            _ended = false;
            Crowd.SetCount(Crowd.Count + 15);
            foreach (var f in FindObjectsByType<FinishGoal>(FindObjectsSortMode.None))
            {
                f.Used = false;
                if (Crowd.Position.z > f.Z - 1.25f)
                    Crowd.NudgeZ(f.Z - 1.25f);
            }
        }

        public async void RewardedDoubleCoins()
        {
            if (!await Ads.ShowRewarded("2x coins")) return;
            _coinMultiplier = 2;
            LastReward *= 2;
        }
    }
}
