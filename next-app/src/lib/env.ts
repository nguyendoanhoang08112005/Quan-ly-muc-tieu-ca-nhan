const DEFAULT_APP_URL = "http://localhost:3000";

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
