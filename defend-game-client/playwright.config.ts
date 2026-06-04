import { defineConfig, devices } from "@playwright/test";
import { createServer } from "node:net";

const port = await getPreviewPort();

export default defineConfig({
  testDir: "tests",
  testMatch: "embed.spec.ts",
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry"
  },
  webServer: {
    command: `aube exec vite preview --config vite.fixture.config.ts --host 127.0.0.1 --port ${port}`,
    cwd: import.meta.dirname,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});

async function findAvailableLoopbackPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("unable to reserve a fixture preview port"));
        return;
      }
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

async function getPreviewPort(): Promise<number> {
  const existingPort = Number.parseInt(process.env.DEFEND_CLIENT_PREVIEW_PORT ?? "", 10);
  if (Number.isInteger(existingPort) && existingPort > 0) {
    return existingPort;
  }

  const port = await findAvailableLoopbackPort();
  process.env.DEFEND_CLIENT_PREVIEW_PORT = String(port);
  return port;
}
