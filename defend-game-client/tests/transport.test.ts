import { describe, expect, it } from "vitest";
import { createInitialGameState } from "../src/game/state";
import { MockSessionTransport } from "../src/net/transport";
import { createPrototypeSession } from "../src/systems/session";

describe("mock session transport", () => {
  it("delivers protocol-shaped commands between two peers", async () => {
    const sessionId = "transport-test";
    const p1 = await createPrototypeSession(
      createInitialGameState(sessionId),
      "p1",
      new MockSessionTransport(sessionId)
    );
    const p2 = await createPrototypeSession(
      createInitialGameState(sessionId),
      "p2",
      new MockSessionTransport(sessionId)
    );

    await p1.dispatch({ type: "player:set-ready", playerId: "p1", ready: true });

    expect(p1.getState().players[0].ready).toBe(true);
    expect(p2.getState().players[0].ready).toBe(true);

    p1.disconnect();
    p2.disconnect();
  });

  it("synchronizes owned hero movement between two protocol-shaped clients", async () => {
    const sessionId = "hero-transport-test";
    const p1 = await createPrototypeSession(
      createInitialGameState(sessionId),
      "p1",
      new MockSessionTransport(sessionId)
    );
    const p2 = await createPrototypeSession(
      createInitialGameState(sessionId),
      "p2",
      new MockSessionTransport(sessionId)
    );

    await p2.dispatch({ type: "player:set-ready", playerId: "p2", ready: true });
    await p1.dispatch({ type: "hero_input", playerId: "p1", inputSeq: 1, moveX: 1, moveY: 0, aimX: 1, aimY: 0, fireHeld: false });
    await p2.dispatch({ type: "hero_input", playerId: "p2", inputSeq: 1, moveX: 0, moveY: -1, aimX: -1, aimY: 0, fireHeld: false });
    await p1.dispatch({ type: "simulation:step", ticks: 2 });

    const p1HeroFromP1 = p1.getState().heroes.find((hero) => hero.playerSlot === "p1");
    const p1HeroFromP2 = p2.getState().heroes.find((hero) => hero.playerSlot === "p1");
    const p2HeroFromP1 = p1.getState().heroes.find((hero) => hero.playerSlot === "p2");
    const p2HeroFromP2 = p2.getState().heroes.find((hero) => hero.playerSlot === "p2");

    expect(p1HeroFromP1?.x).toBeGreaterThan(850);
    expect(p2HeroFromP2?.y).toBeLessThan(470);
    expect(p1HeroFromP1).toEqual(p1HeroFromP2);
    expect(p2HeroFromP1).toEqual(p2HeroFromP2);

    p1.disconnect();
    p2.disconnect();
  });

  it("synchronizes hero collision and shooting state between protocol-shaped clients", async () => {
    const sessionId = "hero-combat-transport-test";
    const p1 = await createPrototypeSession(
      createInitialGameState(sessionId),
      "p1",
      new MockSessionTransport(sessionId)
    );
    const p2 = await createPrototypeSession(
      createInitialGameState(sessionId),
      "p2",
      new MockSessionTransport(sessionId)
    );

    await p1.dispatch({ type: "tower:build", padId: "pad-2", towerTypeId: "ranger-post" });
    await p1.dispatch({ type: "wave:start" });
    await p1.dispatch({ type: "simulation:step", ticks: 1 });
    await p1.dispatch({ type: "hero_input", playerId: "p1", inputSeq: 1, moveX: 0, moveY: 0, aimX: -1, aimY: 0, fireHeld: true });
    await p1.dispatch({ type: "simulation:step", ticks: 10 });

    expect(p1.getState().heroEvents).toEqual(p2.getState().heroEvents);
    expect(p1.getState().heroEvents.some((event) => event.type === "hero.projectile_spawned")).toBe(true);
    expect(p1.getState().heroProjectiles).toEqual(p2.getState().heroProjectiles);
    expect(p1.getState().enemies).toEqual(p2.getState().enemies);

    p1.disconnect();
    p2.disconnect();
  });
});
