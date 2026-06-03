import { defineConfig, devices } from "@playwright/test";
import { createServer } from "node:net";

const publicBaseURL = process.env.DEFEND_PUBLIC_BASE_URL?.trim();
const explicitLocalBaseURL = process.env.PLAYWRIGHT_BASE_URL?.trim();
const localPreview = publicBaseURL || explicitLocalBaseURL ? undefined : await createLocalPreview();
const baseURL = publicBaseURL || explicitLocalBaseURL || localPreview?.baseURL;

if (!baseURL) {
  throw new Error("Unable to determine a Playwright base URL.");
}

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  ...(localPreview
    ? {
        webServer: {
          command: localPreview.command,
          url: localPreview.baseURL,
          reuseExistingServer: false
        }
      }
    : {}),
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});

async function createLocalPreview(): Promise<{ baseURL: string; command: string }> {
  const port = await getPreviewPort();

  return {
    baseURL: `http://127.0.0.1:${port}`,
    command: `aube exec astro preview --host 127.0.0.1 --port ${port}`
  };
}

async function getPreviewPort(): Promise<number> {
  const existingPort = Number.parseInt(process.env.DEFEND_PLAYWRIGHT_PREVIEW_PORT ?? "", 10);

  if (Number.isInteger(existingPort) && existingPort > 0) {
    return existingPort;
  }

  const port = await findAvailableLoopbackPort();
  process.env.DEFEND_PLAYWRIGHT_PREVIEW_PORT = String(port);
  return port;
}

async function findAvailableLoopbackPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Unable to reserve a local Playwright preview port."));
        return;
      }

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(address.port);
      });
    });
  });
}
