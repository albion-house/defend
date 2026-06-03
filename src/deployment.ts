const fallbackDeploymentVersion = "0.1.0+local";

export function normalizeDeploymentVersion(value: string | undefined): string {
  const version = value?.trim();
  return version && version.length > 0 ? version : fallbackDeploymentVersion;
}

export function getDeploymentVersion(): string {
  return normalizeDeploymentVersion(import.meta.env.VITE_DEFEND_DEPLOY_VERSION);
}
