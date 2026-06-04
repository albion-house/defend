import { mountDefendGame, type DefendRuntime } from "../src";
import "../src/styles.css";

declare global {
  interface Window {
    __DEFEND_FIXTURE__?: {
      destroy(): void;
      getRuntime(): DefendRuntime;
    };
  }
}

const root = document.querySelector<HTMLElement>("#game-root");
if (!root) {
  throw new Error("standalone fixture is missing its game host");
}

const runtime = mountDefendGame({
  parent: root,
  deploymentVersion: "0.1.0+standalone"
});

window.__DEFEND_FIXTURE__ = {
  destroy: () => runtime.destroy(),
  getRuntime: () => runtime
};
