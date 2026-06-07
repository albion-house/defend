## 1. Server Package Boundary

- [ ] 1.1 Convert `defend-game-server/` from a README-only stub into a TypeScript package with workspace-owned build/test tasks.
- [ ] 1.2 Define the server runtime entrypoint and test-start helper.
- [ ] 1.3 Extract or expose browser-free gameplay state/rule modules so the server can run the authoritative simulation without importing Phaser or DOM code.

## 2. Room And Slot Lifecycle

- [ ] 2.1 Implement room creation/join for one shared room or explicit room id.
- [ ] 2.2 Assign the first connected client to `p1` and the second connected client to `p2`.
- [ ] 2.3 Reject or hold additional clients without mutating active `p1`/`p2` state.
- [ ] 2.4 Create or activate `hero:p1` and `hero:p2` from assigned slots.
- [ ] 2.5 Mark disconnected player heroes inactive while keeping the room alive for remaining clients.

## 3. Authoritative Commands And Tick

- [ ] 3.1 Accept `hero_input` and existing command-shaped player intent through the server protocol.
- [ ] 3.2 Validate command ownership from the connection's assigned slot rather than trusting client-supplied slot ids.
- [ ] 3.3 Run the fixed simulation tick on the server for relay-backed rooms.
- [ ] 3.4 Synchronize authoritative room snapshots or patches to connected clients.

## 4. Client Relay Path

- [ ] 4.1 Add client configuration for an optional multiplayer relay endpoint.
- [ ] 4.2 Connect the browser client to the server protocol when the endpoint is configured.
- [ ] 4.3 Preserve local/mock authority when no endpoint is configured.

## 5. Tests And Validation

- [ ] 5.1 Add protocol tests that launch the real server and connect two non-visual clients.
- [ ] 5.2 Verify real `p1`/`p2` assignment, synchronized hero state, owned `hero_input`, movement, firing, and disconnect behavior.
- [ ] 5.3 Add server package checks to the repo-level validation gate.
- [ ] 5.4 Run `dev/sandbox openspec validate add-authoritative-multiplayer-server --strict --no-interactive`.
- [ ] 5.5 Run `dev/sandbox mise //:check`.
