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
});
