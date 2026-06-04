import type { GameCommand, GameState } from "../game/state";
import { applyGameCommand, getSerializableSnapshot } from "../game/state";
import type { SessionMessage, SessionTransport } from "../net/transport";

export interface PrototypeSession {
  getState(): GameState;
  dispatch(command: GameCommand): Promise<GameState>;
  disconnect(): void;
}

export async function createPrototypeSession(
  initialState: GameState,
  playerId: string,
  transport: SessionTransport
): Promise<PrototypeSession> {
  let state = initialState;
  await transport.connect();

  const unsubscribe = transport.subscribe((message: SessionMessage) => {
    if (message.playerId !== playerId) {
      state = applyGameCommand(state, message.command);
    }
  });

  return {
    getState: () => state,
    async dispatch(command: GameCommand) {
      state = applyGameCommand(state, command);
      await transport.send({
        sessionId: state.sessionId,
        playerId,
        command,
        snapshot: getSerializableSnapshot(state)
      });
      return state;
    },
    disconnect() {
      unsubscribe();
      transport.disconnect();
    }
  };
}
