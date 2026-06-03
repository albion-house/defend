# Toolchain Policy

Defend uses mise as the local source of truth for project tools and task entry points. Project tools should track the latest stable or LTS-compatible line where practical, while generated lockfiles keep actual installs reproducible.

## Local Tools

- Node uses the current LTS-compatible major line declared in `mise.toml`.
- Aube is declared as the preferred npm-compatible package manager.
- OpenSpec remains installed through mise as an npm-backed tool.
- Python is not part of this repository toolchain unless a future scoped change introduces an actual Python requirement.

`mise.toml` uses fuzzy selectors such as `node = "24"` and `aube = "latest"` so patch and minor updates stay easy to adopt. `mise.lock` records the exact resolved tool versions and checksums; commit it whenever it changes.

The repository sets a 5 day release-age gate for mise tool resolution. Aube project installs use the same 5 day policy through `aube-workspace.yaml` (`minimumReleaseAge: 7200`, in minutes). The workspace file also records reviewed dependency build-script approvals and disables Aube's global virtual store for this project because Vite currently needs per-project materialization.

## Package Manager

Use mise for the normal path:

```sh
mise install
mise run install
mise run dev
mise run check
```

The mise tasks run Aube commands. Aube reads the existing `package-lock.json`, so the npm lockfile remains the shared source of dependency resolution during the rollout.

If Aube is unavailable while diagnosing a local environment problem, npm remains the fallback:

```sh
npm ci
npm run build
npm run test
```

Do not remove `package-lock.json` or convert to an Aube-native lockfile unless a later OpenSpec change explicitly validates that migration.

## GitHub Actions

GitHub Pages CI should use current stable action majors, the mise-managed Node line, and Aube for dependency installation and script execution. The workflow installs tools from `mise.toml` and `mise.lock`, builds the Astro static site, deploys `dist/`, and verifies the published Pages route with Playwright.

When changing tool versions, package-manager behavior, or action versions, run the local install/check/build path first and verify the Pages deployment after the change lands.
