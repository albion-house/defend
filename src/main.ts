import "./styles.css";
import { mountDefendGame } from "./runtime/phaserApp";

const gameRoot = document.querySelector<HTMLElement>("#game-root");

if (gameRoot) {
  mountDefendGame({ parent: gameRoot });
}
