import Phaser from "phaser";
import {
  describeGameState,
  installDebugApi,
  normalizeDeploymentVersion,
  type DefendDebugApi,
  type DefendDebugState
} from "../game/debug";
import { applyGameCommand, createInitialGameState } from "../game/state";
import type { GameCommand, GameState } from "../game/state";
import { MockSessionTransport } from "../net/transport";
import { PrototypeScene, prototypeSceneSize } from "../scenes/PrototypeScene";

export interface DefendRuntime {
  readonly game: Phaser.Game;
  getState(): GameState;
  describe(): DefendDebugState;
  dispatch(command: GameCommand): GameState;
  destroy(): void;
}

export interface MountDefendGameOptions {
  parent: string | HTMLElement;
  deploymentVersion?: string;
  sessionId?: string;
  onStateChange?: (state: DefendDebugState) => void;
}

export function mountDefendGame({
  parent,
  deploymentVersion: deploymentVersionInput,
  sessionId = "local-mock",
  onStateChange
}: MountDefendGameOptions): DefendRuntime {
  const deploymentVersion = normalizeDeploymentVersion(deploymentVersionInput);
  const parentElement = resolveParent(parent);
  let gameState: GameState = createInitialGameState(sessionId);
  const transport = new MockSessionTransport(gameState.sessionId);
  const scene = new PrototypeScene(() => gameState, dispatch);
  let debugApi: DefendDebugApi;

  function dispatch(command: GameCommand): GameState {
    gameState = applyGameCommand(gameState, command);
    scene.refresh();
    notifyHost();
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

  function describe(): DefendDebugState {
    return describeGameState(gameState, deploymentVersion);
  }

  function notifyHost(): void {
    const state = describe();
    onStateChange?.(state);
    parentElement.dispatchEvent(new CustomEvent<DefendDebugState>("defend:state-change", { detail: state }));
  }

  debugApi = installDebugApi(() => gameState, dispatch, deploymentVersion);
  void transport.connect();

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: parentElement,
    width: prototypeSceneSize.width,
    height: prototypeSceneSize.height,
    backgroundColor: "#121418",
    pixelArt: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [scene]
  });
  parentElement.classList.add("defend-game-host");
  notifyHost();

  return {
    game,
    getState: () => gameState,
    describe,
    dispatch,
    destroy: () => {
      transport.disconnect();
      game.destroy(true);
      parentElement.classList.remove("defend-game-host");
      if (window.__DEFEND_DEBUG__ === debugApi) {
        delete window.__DEFEND_DEBUG__;
      }
    }
  };
}

function resolveParent(parent: string | HTMLElement): HTMLElement {
  if (typeof parent !== "string") {
    return parent;
  }

  const element = document.querySelector<HTMLElement>(parent);
  if (!element) {
    throw new Error(`Unable to find Defend game host: ${parent}`);
  }
  return element;
}
