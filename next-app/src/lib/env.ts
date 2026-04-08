const DEFAULT_APP_URL = "http://localhost:3000";
const REQUIRED_RUNTIME_ENV_NAMES = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET"
] as const;

export function getAppBaseUrl() {
  const envUrl = process.env["NEXTAUTH_URL"]?.trim();

  if (!envUrl) {
    return new URL(DEFAULT_APP_URL);
  }

  try {
    return new URL(envUrl);
  } catch {
    return new URL(DEFAULT_APP_URL);
  }
}

export function getRequiredRuntimeEnvNames() {
  return [...REQUIRED_RUNTIME_ENV_NAMES];
}

export function getRuntimeEnvStatus() {
  const required = getRequiredRuntimeEnvNames();
  const missing = required.filter((name) => !process.env[name]?.trim());
  const present = required.filter((name) => process.env[name]?.trim());

  return {
    missing,
    present,
    required
  };
}

export function getDeploymentStage() {
  return process.env["APP_STAGE"]?.trim() || process.env["NODE_ENV"] || "development";
}

export function getDeploymentRelease() {
  return process.env["APP_RELEASE"]?.trim() || null;
}
