import assert from "node:assert/strict";
import test from "node:test";
import { CLOUD_TYPES, LAYER_SPEED, WEATHER_AUDIO, WEATHER_PROFILES, WeatherSystem, weatherProfile, windGain } from "../game/CloudSystem.js";

test("eleven weather profiles match the world band", () => {
  const ids = ["meadow", "dunes", "frost", "grove", "ember", "amber", "lagoon", "prism", "nightfen", "highwake", "crown"];
  for (const id of ids) {
    assert.ok(WEATHER_PROFILES[id], id);
    assert.ok(CLOUD_TYPES[WEATHER_PROFILES[id].type], `${id} type`);
  }
  assert.equal(weatherProfile("meadow").speed, 0.01);
  assert.equal(weatherProfile("meadow").coverage, 30);
  assert.equal(weatherProfile("meadow").count, 50);
  assert.equal(weatherProfile("dunes").speed, 0.03);
  assert.equal(weatherProfile("dunes").coverage, 10);
  assert.equal(weatherProfile("dunes").dust, true);
  assert.equal(weatherProfile("frost").speed, 0.005);
  assert.equal(weatherProfile("grove").coverage, 60);
  assert.equal(weatherProfile("ember").color, 0xff6b35);
  assert.equal(weatherProfile("amber").color, 0xffb347);
  assert.equal(weatherProfile("lagoon").speed, 0.025);
  assert.equal(weatherProfile("prism").speed, 0.008);
  assert.equal(weatherProfile("nightfen").color, 0x4a0082);
  assert.equal(weatherProfile("nightfen").coverage, 80);
  assert.equal(weatherProfile("highwake").coverage, 20);
  const crown = weatherProfile("crown");
  assert.equal(crown.speed, 0.05);
  assert.equal(crown.coverage, 90);
  assert.equal(crown.color, 0x1a1a1a);
  assert.equal(crown.lightning, true);
  assert.equal(crown.rain, true);
  assert.deepEqual(LAYER_SPEED, [0.5, 1, 1.5]);
});

test("weather audio uses sunny −10 dB, cloudy −5 dB, storm 0 dB", () => {
  assert.equal(WEATHER_AUDIO.sunny.windDb, -10);
  assert.equal(WEATHER_AUDIO.cloudy.windDb, -5);
  assert.equal(WEATHER_AUDIO.storm.windDb, 0);
  assert.ok(Math.abs(windGain(-10) - 0.031622776) < 1e-6);
  assert.equal(windGain(0), 0.1);
});

test("WeatherSystem coverage, types, and storm blend", () => {
  const wx = new WeatherSystem(null);
  wx.setWorld("meadow");
  assert.equal(wx.profile.type, "cumulus");
  wx.updateCloudCover(80);
  assert.equal(wx.coverTarget, 80);
  wx.setWeatherType("storm");
  assert.equal(wx.type, "storm");
  assert.ok(wx.speedTarget > 1);
  wx.endStorm();
  assert.ok(wx.type === "sunny" || wx.type === "cloudy");
  wx.setWorld("crown");
  wx.beginStorm();
  assert.equal(wx.type, "storm");
  assert.equal(wx.playLightning(), true);
  assert.equal(wx.consumeStrike(), true);
  wx._thunderIn = 0;
  wx.thunderReady = true;
  assert.equal(wx.consumeThunder(), true);
  wx.dispose();
});
