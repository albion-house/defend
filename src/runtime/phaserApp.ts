import Phaser from "phaser";
import { getDeploymentVersion } from "../deployment";
import { installDebugApi } from "../game/debug";
import { applyGameCommand, createInitialGameState } from "../game/state";
import type { GameCommand, GameState } from "../game/state";
import { MockSessionTransport } from "../net/transport";
import { PrototypeScene, prototypeSceneSize } from "../scenes/PrototypeScene";

export interface DefendRuntime {
  readonly game: Phaser.Game;
  getState(): GameState;
  dispatch(command: GameCommand): GameState;
  destroy(): void;
}

export interface MountDefendGameOptions {
  parent: string | HTMLElement;
  deploymentVersion?: string;
  sessionId?: string;
}

export function mountDefendGame({
  parent,
  deploymentVersion = getDeploymentVersion(),
  sessionId = "local-mock"
}: MountDefendGameOptions): DefendRuntime {
  let gameState: GameState = createInitialGameState(sessionId);
  const transport = new MockSessionTransport(gameState.sessionId);

  function dispatch(command: GameCommand): GameState {
    gameState = applyGameCommand(gameState, command);
    window.dispatchEvent(new CustomEvent("defend:state-change", { detail: command }));
    if (command.type !== "simulation:step" && command.type !== "simulation:tick") {
      void transport.send({
        sessionId: gameState.sessionId,
        playerId: "local",
        command,
        snapshot: structuredClone(gameState)
      });
    }
    return gameState;
  }

  installDebugApi(() => gameState, dispatch, deploymentVersion);
  void transport.connect();

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: prototypeSceneSize.width,
    height: prototypeSceneSize.height,
    backgroundColor: "#121418",
    pixelArt: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [new PrototypeScene(() => gameState, dispatch, deploymentVersion)]
  });

  return {
    game,
    getState: () => gameState,
    dispatch,
    destroy: () => {
      transport.disconnect();
      game.destroy(true);
    }
  };
}
