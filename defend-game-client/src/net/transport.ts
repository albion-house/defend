import type { GameCommand, GameStateSnapshot } from "../game/state";

export interface SessionMessage {
  sessionId: string;
  playerId: string;
  command: GameCommand;
  snapshot?: GameStateSnapshot;
}

export type SessionMessageHandler = (message: SessionMessage) => void;

export interface SessionTransport {
  readonly sessionId: string;
  connect(): Promise<void>;
  disconnect(): void;
  subscribe(handler: SessionMessageHandler): () => void;
  send(message: SessionMessage): Promise<void>;
}

export class MockSessionTransport implements SessionTransport {
  private static sessions = new Map<string, Set<MockSessionTransport>>();
  private handlers = new Set<SessionMessageHandler>();
  private connected = false;

  constructor(public readonly sessionId: string) {}

  async connect(): Promise<void> {
    const peers = MockSessionTransport.sessions.get(this.sessionId) ?? new Set();
    peers.add(this);
    MockSessionTransport.sessions.set(this.sessionId, peers);
    this.connected = true;
  }

  disconnect(): void {
    const peers = MockSessionTransport.sessions.get(this.sessionId);
    peers?.delete(this);
    if (peers?.size === 0) {
      MockSessionTransport.sessions.delete(this.sessionId);
    }
    this.connected = false;
    this.handlers.clear();
  }

  subscribe(handler: SessionMessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  async send(message: SessionMessage): Promise<void> {
    if (!this.connected) {
      throw new Error(`Mock transport ${this.sessionId} is not connected`);
    }

    const peers = MockSessionTransport.sessions.get(this.sessionId) ?? new Set();
    await Promise.resolve();
    for (const peer of peers) {
      peer.deliver(message);
    }
  }

  private deliver(message: SessionMessage): void {
    for (const handler of this.handlers) {
      handler(message);
    }
  }
}
