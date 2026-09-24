import assert from "node:assert/strict";
import test from "node:test";
import {
  decideTutorialMode,
  beginPlaySession,
  applyTutorialEvent,
  normalizeTutorial,
  createTutorialPersistence,
} from "../game/Tutorial.js";
import { canRestart } from "../game/controls.js";

test("first launch shows full tutorial", () => {
  assert.equal(decideTutorialMode({}), "full");
  assert.equal(decideTutorialMode(normalizeTutorial(null)), "full");
});

test("second session shows refresher", () => {
  assert.equal(decideTutorialMode({ sessionsStarted: 1 }), "refresher");
});

test("after two sessions there is no auto tutorial", () => {
  assert.equal(decideTutorialMode({ sessionsStarted: 2 }), "none");
  assert.equal(decideTutorialMode({ sessionsStarted: 9, completedFull: true }), "none");
});

test("skip and hide stop auto tutorial", () => {
  assert.equal(decideTutorialMode({ skipped: true }), "none");
  assert.equal(decideTutorialMode({ hideInstructions: true }), "none");
});

test("replay forces full tutorial even after skip", () => {
  assert.equal(decideTutorialMode({ skipped: true, sessionsStarted: 4 }, { replay: true }), "full");
  assert.equal(decideTutorialMode({ hideInstructions: true }, { replay: true }), "full");
});

test("beginPlaySession increments only for auto onboarding", () => {
  const first = beginPlaySession({});
  assert.equal(first.mode, "full");
  assert.equal(first.state.sessionsStarted, 1);

  const second = beginPlaySession(first.state);
  assert.equal(second.mode, "refresher");
  assert.equal(second.state.sessionsStarted, 2);

  const third = beginPlaySession(second.state);
  assert.equal(third.mode, "none");
  assert.equal(third.state.sessionsStarted, 2);
});

test("skip is sticky", () => {
  const skipped = applyTutorialEvent({}, "skip");
  assert.equal(skipped.skipped, true);
  const next = beginPlaySession(skipped);
  assert.equal(next.mode, "none");
});

test("hide then show restores later onboarding", () => {
  let s = applyTutorialEvent({}, "hide");
  assert.equal(decideTutorialMode(s), "none");
  s = applyTutorialEvent(s, "show");
  assert.equal(decideTutorialMode(s), "full");
});

test("replay clears hide and does not increment sessions", () => {
  const hidden = applyTutorialEvent({ sessionsStarted: 2 }, "hide");
  const replay = beginPlaySession(hidden, { replay: true });
  assert.equal(replay.mode, "full");
  assert.equal(replay.state.hideInstructions, false);
  assert.equal(replay.state.sessionsStarted, 2);
});

test("completed full tutorial still gets a second-session refresher", () => {
  const afterFull = applyTutorialEvent({ sessionsStarted: 1 }, "complete-full");
  assert.equal(decideTutorialMode(afterFull), "refresher");
});

test("skip survives save and load like a page refresh", () => {
  const mem = new Map();
  const storage = {
    getItem: (k) => mem.get(k) ?? null,
    setItem: (k, v) => mem.set(k, v),
  };
  const store = createTutorialPersistence(storage);
  store.save(applyTutorialEvent({}, "skip"));
  const loaded = store.load();
  assert.equal(loaded.skipped, true);
  assert.equal(decideTutorialMode(loaded), "none");
});

test("hide instructions survives save and load", () => {
  const mem = new Map();
  const storage = {
    getItem: (k) => mem.get(k) ?? null,
    setItem: (k, v) => mem.set(k, v),
  };
  const store = createTutorialPersistence(storage);
  store.save(applyTutorialEvent({}, "hide"));
  assert.equal(decideTutorialMode(store.load()), "none");
  store.save(applyTutorialEvent(store.load(), "show"));
  assert.equal(decideTutorialMode(store.load()), "full");
});

test("R only restarts from pause or end, not mid-run or menu", () => {
  assert.equal(canRestart("menu", false, false), false);
  assert.equal(canRestart("playing", false, false), false);
  assert.equal(canRestart("playing", false, true), true);
  assert.equal(canRestart("fail", true, false), true);
  assert.equal(canRestart("win", true, false), true);
});
