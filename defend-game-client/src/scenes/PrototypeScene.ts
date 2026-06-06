import Phaser from "phaser";
import { getMissionContent, type GameCommand, type GameState, type PlayerId, type TowerTypeId, type Vec2 } from "../game/state";

const WORLD_WIDTH = 1280;
const WORLD_HEIGHT = 720;

const colors = {
  background: 0x121418,
  header: 0x18201d,
  field: 0x26382f,
  fieldEdge: 0x86b894,
  water: 0x2b5f6b,
  pathA: 0xe0a75e,
  pathB: 0x73b6c9,
  merge: 0xf0cf68,
  objective: 0xd95d5d,
  padOpen: 0xf5f0df,
  padSelected: 0xf0cf68,
  padOccupied: 0x8cc86f,
  text: "#f5f0df",
  mutedText: "#a7b3ad",
  dangerText: "#ffb0a8",
  panel: 0x20302b,
  panelStroke: 0xf5f0df,
  ranger: 0x72d1ff,
  blast: 0xffb35c,
  magic: 0xc5a3ff,
  blocker: 0x9ad38b,
  enemy: 0xf5f0df,
  enemyCore: 0xd95d5d,
  heroP1: 0x7ed7ff,
  heroP2: 0xb88cff,
  heroShot: 0xffffff
};

const towerColors: Record<TowerTypeId, number> = {
  "ranger-post": colors.ranger,
  "blast-foundry": colors.blast,
  "veil-spire": colors.magic,
  "stoneward-lodge": colors.blocker
};

const panel = {
  x: 906,
  y: 92,
  width: 340,
  height: 584,
  inset: 18,
  contentWidth: 304
};

export class PrototypeScene extends Phaser.Scene {
  private graphics?: Phaser.GameObjects.Graphics;
  private hudText?: Phaser.GameObjects.Text;
  private guideText?: Phaser.GameObjects.Text;
  private logText?: Phaser.GameObjects.Text;
  private labelGroup?: Phaser.GameObjects.Group;
  private scaleResizeHandler?: () => void;
  private tickAccumulatorMs = 0;
  private heroKeys?: Record<string, Phaser.Input.Keyboard.Key>;
  private inputSeq = 0;
  private fireHeld = false;
  private pointerWorld: Vec2 | null = null;
  private lastHeroInputSignature = "";

  constructor(
    private readonly getState: () => GameState,
    private readonly dispatch: (command: GameCommand) => GameState,
    private readonly playerSlot: PlayerId = "p1"
  ) {
    super("PrototypeScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(colors.background);
    this.graphics = this.add.graphics();
    this.labelGroup = this.add.group();
    this.hudText = this.add.text(24, 14, "", {
      color: colors.text,
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "17px",
      lineSpacing: 7
    });
    this.guideText = this.add.text(422, 14, "", {
      color: colors.text,
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "15px",
      lineSpacing: 5,
      fixedWidth: 438,
      align: "center",
      wordWrap: { width: 438 }
    });
    this.logText = this.add.text(panel.x + panel.inset + 10, 598, "", {
      color: colors.mutedText,
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "12px",
      lineSpacing: 4,
      fixedWidth: panel.contentWidth - 14,
      wordWrap: { width: panel.contentWidth - 14 }
    });

    this.renderState();
    this.installHeroInput();
    this.scaleResizeHandler = () => this.renderState();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.scaleResizeHandler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.scaleResizeHandler) {
        this.scale.off(Phaser.Scale.Events.RESIZE, this.scaleResizeHandler);
      }
    });
  }

  refresh(): void {
    if (this.scene.isActive()) {
      this.renderState();
    }
  }

  update(_time: number, delta: number): void {
    const state = this.getState();
    this.sendHeroInputFromControls();
    if (state.mission.status !== "victory" && state.mission.status !== "defeat") {
      this.tickAccumulatorMs += delta;
      const ticks = Math.floor(this.tickAccumulatorMs / state.mission.fixedTickMs);
      if (ticks > 0) {
        this.tickAccumulatorMs -= ticks * state.mission.fixedTickMs;
        this.dispatch({ type: "simulation:step", ticks: Math.min(ticks, 6) });
        this.renderState();
      }
    } else {
      this.tickAccumulatorMs = 0;
    }
  }

  private renderState(): void {
    const state = this.getState();
    this.graphics?.clear();
    this.labelGroup?.clear(true, true);

    this.drawArena();
    for (const path of state.paths) {
      this.drawPath(path.id, path.entrance, path.waypoints);
    }
    this.drawObjective(state.objective);
    this.drawBuildPads(state);
    this.drawTowers(state);
    this.drawHeroProjectiles(state);
    this.drawEnemies(state);
    this.drawEffects(state);
    this.drawHeroes(state);
    this.drawLabels();
    this.drawPanelHeader(state);
    this.drawTowerButtons(state);
    this.drawWaveControls(state);
    this.drawOutcome(state);

    this.hudText?.setText([
      `${state.mission.title}`,
      `Objective ${state.objective.currentHp}/${state.objective.maxHp}`,
      `Gold ${state.sharedGold}`,
      `Wave ${state.wave.index}/${state.wave.total} ${this.formatWaveLabel(state)}`,
      `Towers ${state.towers.length}  Enemies ${state.enemies.length}  Heroes ${state.heroes.filter((hero) => hero.connected).length}`
    ]);
    this.guideText?.setText(this.guideForState(state));
    this.logText?.setText(state.messageLog.slice(0, 3).join("\n"));
  }

  private drawArena(): void {
    const graphics = this.requireGraphics();
    graphics.fillStyle(colors.header, 1);
    graphics.fillRect(0, 0, WORLD_WIDTH, 72);
    graphics.fillStyle(colors.water, 0.78);
    graphics.fillRect(0, 72, WORLD_WIDTH, WORLD_HEIGHT - 72);
    graphics.fillStyle(colors.field, 1);
    graphics.lineStyle(4, colors.fieldEdge, 0.95);
    graphics.fillRoundedRect(52, 92, WORLD_WIDTH - 185, WORLD_HEIGHT - 142, 8);
    graphics.strokeRoundedRect(52, 92, WORLD_WIDTH - 185, WORLD_HEIGHT - 142, 8);
    graphics.fillStyle(0x1b2a25, 1);
    graphics.fillRoundedRect(panel.x, panel.y, panel.width, panel.height, 8);
    graphics.lineStyle(2, colors.panelStroke, 0.2);
    graphics.strokeRoundedRect(panel.x, panel.y, panel.width, panel.height, 8);
  }

  private drawPath(id: string, entrance: Vec2, waypoints: Vec2[]): void {
    const graphics = this.requireGraphics();
    const color = id === "A" ? colors.pathA : colors.pathB;
    const points = [entrance, ...waypoints];

    graphics.lineStyle(28, 0x231a13, 0.3);
    this.strokePolyline(points);
    graphics.lineStyle(22, color, 0.35);
    this.strokePolyline(points);
    graphics.lineStyle(5, color, 0.98);
    this.strokePolyline(points);

    graphics.fillStyle(color, 1);
    graphics.fillCircle(entrance.x, entrance.y, 18);
  }

  private drawBuildPads(state: GameState): void {
    const graphics = this.requireGraphics();
    for (const pad of state.buildPads) {
      const selected = state.mission.selectedPadId === pad.id;
      const occupied = Boolean(pad.occupiedBy);
      const fill = occupied ? colors.padOccupied : selected ? colors.padSelected : colors.padOpen;
      graphics.fillStyle(fill, occupied || selected ? 0.32 : 0.16);
      graphics.lineStyle(3, fill, selected ? 1 : 0.82);
      graphics.fillRoundedRect(pad.position.x - 32, pad.position.y - 32, 64, 64, 8);
      graphics.strokeRoundedRect(pad.position.x - 32, pad.position.y - 32, 64, 64, 8);
      this.addLabel(pad.position.x - 34, pad.position.y + 38, pad.role, 12, selected ? "#f0cf68" : colors.mutedText);

      const hit = this.add.zone(pad.position.x, pad.position.y, 74, 74).setInteractive({ cursor: "pointer" });
      hit.on("pointerdown", () => {
        this.dispatch({ type: "pad:select", padId: pad.id });
        this.renderState();
      });
      this.labelGroup?.add(hit);
    }
  }

  private drawTowers(state: GameState): void {
    const graphics = this.requireGraphics();
    for (const tower of state.towers) {
      const color = towerColors[tower.typeId];
      graphics.fillStyle(color, 0.85);
      graphics.lineStyle(3, 0x101410, 0.9);
      graphics.fillCircle(tower.position.x, tower.position.y, 23);
      graphics.strokeCircle(tower.position.x, tower.position.y, 23);
      graphics.fillStyle(0x101410, 0.9);
      graphics.fillCircle(tower.position.x, tower.position.y, 8);

      if (state.mission.selectedPadId === tower.padId) {
        const definition = getMissionContent().towers.find((candidate) => candidate.id === tower.typeId);
        if (definition?.range) {
          graphics.lineStyle(2, color, 0.16);
          graphics.strokeCircle(tower.position.x, tower.position.y, definition.range);
        }
      }
    }
  }

  private drawEnemies(state: GameState): void {
    const graphics = this.requireGraphics();
    for (const enemy of state.enemies) {
      const radius = enemy.typeId === "brute" ? 17 : enemy.typeId === "skitter" ? 12 : 15;
      const color = enemy.status === "blocked" ? colors.merge : colors.enemy;
      graphics.fillStyle(color, 1);
      graphics.lineStyle(3, colors.enemyCore, 1);
      graphics.fillCircle(enemy.position.x, enemy.position.y, radius);
      graphics.strokeCircle(enemy.position.x, enemy.position.y, radius);
      graphics.fillStyle(enemy.typeId === "mender" ? colors.magic : enemy.typeId === "shieldbearer" ? colors.blocker : colors.enemyCore, 1);
      graphics.fillCircle(enemy.position.x, enemy.position.y, 6);

      const healthWidth = 34;
      const healthProgress = enemy.currentHp / enemy.maxHp;
      graphics.fillStyle(0x101410, 0.9);
      graphics.fillRect(enemy.position.x - healthWidth / 2, enemy.position.y - 28, healthWidth, 5);
      graphics.fillStyle(healthProgress > 0.5 ? 0x82d279 : healthProgress > 0.25 ? 0xf0cf68 : 0xd95d5d, 1);
      graphics.fillRect(enemy.position.x - healthWidth / 2, enemy.position.y - 28, healthWidth * healthProgress, 5);
    }
  }

  private drawEffects(state: GameState): void {
    const graphics = this.requireGraphics();
    for (const effect of state.effects) {
      const alpha = Math.max(0.15, effect.ttlTicks / 10);
      const color =
        effect.kind === "blast"
          ? colors.blast
          : effect.kind === "slow"
            ? colors.magic
            : effect.kind === "block"
              ? colors.blocker
              : effect.kind === "leak" || effect.kind === "outcome"
                ? colors.objective
                : colors.ranger;
      graphics.lineStyle(3, color, alpha);
      graphics.strokeCircle(effect.position.x, effect.position.y, 12 + (10 - effect.ttlTicks) * 2);
      this.addLabel(effect.position.x + 12, effect.position.y - 18, effect.label, 12, effect.kind === "leak" ? colors.dangerText : colors.text);
    }
  }

  private drawObjective(objective: GameState["objective"]): void {
    const graphics = this.requireGraphics();
    graphics.fillStyle(colors.objective, 0.95);
    graphics.lineStyle(4, 0xf5f0df, 1);
    graphics.fillRoundedRect(objective.position.x - 44, objective.position.y - 62, 88, 124, 8);
    graphics.strokeRoundedRect(objective.position.x - 44, objective.position.y - 62, 88, 124, 8);
    const healthProgress = objective.currentHp / objective.maxHp;
    graphics.fillStyle(0x101410, 0.9);
    graphics.fillRect(objective.position.x - 42, objective.position.y + 72, 84, 8);
    graphics.fillStyle(healthProgress > 0.5 ? 0x82d279 : healthProgress > 0.25 ? 0xf0cf68 : 0xd95d5d, 1);
    graphics.fillRect(objective.position.x - 42, objective.position.y + 72, 84 * healthProgress, 8);
  }

  private drawHeroProjectiles(state: GameState): void {
    const graphics = this.requireGraphics();
    for (const projectile of state.heroProjectiles) {
      graphics.fillStyle(colors.heroShot, 0.95);
      graphics.lineStyle(2, colors.ranger, 0.9);
      graphics.fillCircle(projectile.x, projectile.y, projectile.radius);
      graphics.strokeCircle(projectile.x, projectile.y, projectile.radius + 2);
    }
  }

  private drawHeroes(state: GameState): void {
    const graphics = this.requireGraphics();
    for (const hero of state.heroes.filter((candidate) => candidate.connected)) {
      const color = hero.playerSlot === "p1" ? colors.heroP1 : colors.heroP2;
      graphics.fillStyle(color, hero.alive ? 0.92 : 0.3);
      graphics.lineStyle(3, 0x101410, 0.92);
      graphics.fillCircle(hero.x, hero.y, hero.radius);
      graphics.strokeCircle(hero.x, hero.y, hero.radius);
      graphics.lineStyle(4, colors.heroShot, 0.92);
      graphics.lineBetween(hero.x, hero.y, hero.x + hero.aimX * (hero.radius + 16), hero.y + hero.aimY * (hero.radius + 16));
      this.addLabel(hero.x - 8, hero.y - 7, hero.playerSlot.toUpperCase(), 11, "#101410");
    }
  }

  private drawPanelHeader(state: GameState): void {
    const graphics = this.requireGraphics();
    const x = panel.x + panel.inset;
    const y = panel.y + 16;
    this.addLabel(x, y, "Command", 19, colors.text);
    this.addLabel(x + 108, y + 4, `${state.mission.status.toUpperCase()}  Wave ${state.wave.index}/${state.wave.total}`, 12, colors.mutedText);

    graphics.fillStyle(0x14221f, 0.94);
    graphics.lineStyle(1, colors.panelStroke, 0.18);
    graphics.fillRoundedRect(x, y + 30, panel.contentWidth, 54, 6);
    graphics.strokeRoundedRect(x, y + 30, panel.contentWidth, 54, 6);
    this.addLabel(x + 12, y + 42, "Gate", 12, colors.mutedText);
    this.addLabel(x + 52, y + 42, `${state.objective.currentHp}/${state.objective.maxHp}`, 14, colors.text);
    this.addLabel(x + 118, y + 42, "Gold", 12, colors.mutedText);
    this.addLabel(x + 160, y + 42, `${state.sharedGold}`, 14, colors.text);
    const pressure = state.wave.active
      ? `${state.wave.enemiesRemaining} unresolved`
      : `${state.wave.wavesCompleted} cleared`;
    this.addLabel(x + 12, y + 64, pressure, 12, colors.mutedText);
  }

  private drawTowerButtons(state: GameState): void {
    const graphics = this.requireGraphics();
    const content = getMissionContent();
    const x = panel.x + panel.inset;
    let y = 218;
    this.addLabel(x, y - 24, "Build Towers", 15, colors.text);
    this.addLabel(x + 122, y - 20, "select pad, then choose", 11, colors.mutedText);

    for (const tower of content.towers) {
      const selected = state.mission.selectedTowerTypeId === tower.id;
      const canAfford = state.sharedGold >= tower.cost;
      const color = towerColors[tower.id];
      graphics.fillStyle(selected ? color : colors.panel, selected ? 0.32 : 0.92);
      graphics.lineStyle(2, canAfford ? color : 0x59625c, selected ? 1 : 0.72);
      graphics.fillRoundedRect(x, y, panel.contentWidth, 40, 6);
      graphics.strokeRoundedRect(x, y, panel.contentWidth, 40, 6);
      graphics.fillStyle(color, canAfford ? 1 : 0.35);
      graphics.fillCircle(x + 20, y + 20, 9);
      this.addLabel(x + 40, y + 5, tower.label, 12, canAfford ? colors.text : colors.mutedText);
      this.addLabel(x + 230, y + 5, `${tower.cost}g`, 12, canAfford ? colors.text : colors.mutedText);
      this.addLabel(x + 40, y + 22, tower.role, 10, colors.mutedText);

      const hit = this.add.zone(x + panel.contentWidth / 2, y + 20, panel.contentWidth, 40).setInteractive({ cursor: "pointer" });
      hit.on("pointerdown", () => {
        this.dispatch({ type: "tower:select-type", towerTypeId: tower.id });
        const selectedPadId = this.getState().mission.selectedPadId;
        if (selectedPadId) {
          this.dispatch({ type: "tower:build", padId: selectedPadId, towerTypeId: tower.id });
        }
        this.renderState();
      });
      this.labelGroup?.add(hit);
      y += 48;
    }
  }

  private drawWaveControls(state: GameState): void {
    const graphics = this.requireGraphics();
    const x = panel.x + panel.inset;
    const y = 434;
    const canStart = !state.wave.active && state.mission.status !== "victory" && state.mission.status !== "defeat";
    this.addLabel(x, y - 24, "Wave Actions", 15, colors.text);
    this.drawButton(x, y, 144, 36, canStart ? "Start Wave" : "Wave Active", canStart);
    if (canStart) {
      const hit = this.add.zone(x + 72, y + 18, 144, 36).setInteractive({ cursor: "pointer" });
      hit.on("pointerdown", () => {
        this.dispatch({ type: "wave:start" });
        this.renderState();
      });
      this.labelGroup?.add(hit);
    }

    this.drawButton(x + 160, y, 144, 36, "Restart", true);
    const restart = this.add.zone(x + 232, y + 18, 144, 36).setInteractive({ cursor: "pointer" });
    restart.on("pointerdown", () => {
      this.dispatch({ type: "mission:restart" });
      this.renderState();
    });
    this.labelGroup?.add(restart);

    graphics.fillStyle(0x14221f, 0.94);
    graphics.lineStyle(1, colors.merge, 0.55);
    graphics.fillRoundedRect(x, y + 50, panel.contentWidth, 66, 6);
    graphics.strokeRoundedRect(x, y + 50, panel.contentWidth, 66, 6);
    this.addLabel(x + 12, y + 60, "Plan", 11, "#f0cf68");
    this.addLabel(x + 54, y + 60, "Cover a bend, then the merge.", 11, colors.text);
    this.addLabel(x + 12, y + 80, "Veil Spires punish armored pressure.", 11, colors.mutedText);
    this.addLabel(x + 12, y + 98, "Blockers buy time near chokepoints.", 11, colors.mutedText);

    this.addLabel(x, y + 132, "Recent", 13, colors.text);
    graphics.fillStyle(0x101817, 0.72);
    graphics.lineStyle(1, colors.panelStroke, 0.14);
    graphics.fillRoundedRect(x, y + 150, panel.contentWidth, 46, 6);
    graphics.strokeRoundedRect(x, y + 150, panel.contentWidth, 46, 6);
  }

  private drawOutcome(state: GameState): void {
    if (state.mission.status !== "victory" && state.mission.status !== "defeat") {
      return;
    }
    const graphics = this.requireGraphics();
    const label = state.mission.status === "victory" ? "Victory" : "Defeat";
    const detail =
      state.mission.status === "victory"
        ? "Crossing secured. Restart to test a new build."
        : "The gate fell. Restart and tighten the merge.";
    graphics.fillStyle(0x101410, 0.82);
    graphics.fillRoundedRect(330, 254, 420, 132, 8);
    graphics.lineStyle(3, state.mission.status === "victory" ? colors.blocker : colors.objective, 1);
    graphics.strokeRoundedRect(330, 254, 420, 132, 8);
    this.addLabel(470, 280, label, 30, colors.text);
    this.addLabel(374, 326, detail, 16, colors.text);
  }

  private drawButton(x: number, y: number, width: number, height: number, label: string, enabled: boolean): void {
    const graphics = this.requireGraphics();
    graphics.fillStyle(enabled ? 0x2f5a4d : 0x3b403d, enabled ? 0.96 : 0.68);
    graphics.lineStyle(2, colors.panelStroke, enabled ? 0.82 : 0.35);
    graphics.fillRoundedRect(x, y, width, height, 6);
    graphics.strokeRoundedRect(x, y, width, height, 6);
    this.addLabel(x + 15, y + Math.max(9, height / 2 - 8), label, 13, enabled ? colors.text : colors.mutedText);
  }

  private drawLabels(): void {
    this.addLabel(80, 130, "North Causeway", 14);
    this.addLabel(80, 586, "South Causeway", 14);
    this.addLabel(610, 374, "Merge", 15, "#f0cf68");
    this.addLabel(790, 436, "Gate", 15);
  }

  private guideForState(state: GameState): string {
    if (state.mission.status === "victory") {
      return "Clean hold. Restart instantly to try fewer towers or a different opening.";
    }
    if (state.mission.status === "defeat") {
      return "Fast retry is ready. Try earlier bend damage plus a blocker near the merge.";
    }
    if (state.towers.length === 0) {
      return "Select a pad, build a Ranger Post, then start the scout wave.";
    }
    if (!state.wave.active && state.wave.wavesCompleted === 0) {
      return "Good. Start Wave, then add splash or blockers as gold comes in.";
    }
    if (state.wave.active) {
      return "Watch the merge. Spend rewards quickly and use magic into armored pressure.";
    }
    return "Wave clear. Add coverage before the next push.";
  }

  private addLabel(x: number, y: number, text: string, size: number, color = colors.text): void {
    const label = this.add.text(x, y, text, {
      color,
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: `${size}px`
    });
    this.labelGroup?.add(label);
  }

  private installHeroInput(): void {
    this.heroKeys = this.input.keyboard?.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
      arrowUp: "UP",
      arrowLeft: "LEFT",
      arrowDown: "DOWN",
      arrowRight: "RIGHT"
    }) as Record<string, Phaser.Input.Keyboard.Key> | undefined;
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.pointerWorld = { x: pointer.worldX, y: pointer.worldY };
    });
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.pointerWorld = { x: pointer.worldX, y: pointer.worldY };
      this.fireHeld = true;
      this.sendHeroInputFromControls(true);
    });
    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      this.pointerWorld = { x: pointer.worldX, y: pointer.worldY };
      this.fireHeld = false;
      this.sendHeroInputFromControls(true);
    });
  }

  private sendHeroInputFromControls(force = false): void {
    const hero = this.getState().heroes.find((candidate) => candidate.playerSlot === this.playerSlot);
    if (!hero?.connected) {
      return;
    }
    const moveX = this.isDown("right", "arrowRight") ? 1 : this.isDown("left", "arrowLeft") ? -1 : 0;
    const moveY = this.isDown("down", "arrowDown") ? 1 : this.isDown("up", "arrowUp") ? -1 : 0;
    const aimX = this.pointerWorld ? this.pointerWorld.x - hero.x : hero.aimX;
    const aimY = this.pointerWorld ? this.pointerWorld.y - hero.y : hero.aimY;
    const signature = `${moveX}:${moveY}:${Math.round(aimX)}:${Math.round(aimY)}:${this.fireHeld ? 1 : 0}`;
    if (!force && signature === this.lastHeroInputSignature) {
      return;
    }
    this.lastHeroInputSignature = signature;
    this.inputSeq += 1;
    this.dispatch({
      type: "hero_input",
      playerId: this.playerSlot,
      inputSeq: this.inputSeq,
      moveX,
      moveY,
      aimX,
      aimY,
      fireHeld: this.fireHeld
    });
    this.renderState();
  }

  private isDown(primary: string, secondary: string): boolean {
    return Boolean(this.heroKeys?.[primary]?.isDown || this.heroKeys?.[secondary]?.isDown);
  }

  private strokePolyline(points: Vec2[]): void {
    const graphics = this.requireGraphics();
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) {
      graphics.lineTo(point.x, point.y);
    }
    graphics.strokePath();
  }

  private requireGraphics(): Phaser.GameObjects.Graphics {
    if (!this.graphics) {
      throw new Error("PrototypeScene graphics not initialized");
    }
    return this.graphics;
  }

  private formatWaveLabel(state: GameState): string {
    if (state.mission.status === "victory" || state.mission.status === "defeat") {
      return state.mission.status;
    }
    return state.wave.active ? "active" : "ready";
  }
}

export const prototypeSceneSize = {
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT
};
