import "dotenv/config";
import * as mariadb from "mariadb";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const REQUIRED_ENV_NAMES = ["DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET"];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function printResult(label, ok, detail) {
  const prefix = ok ? "[ok]" : "[fail]";

  console.log(`${prefix} ${label}${detail ? `: ${detail}` : ""}`);
}

function printWarning(label, detail) {
  console.log(`[warn] ${label}${detail ? `: ${detail}` : ""}`);
}

function validateUrl(label, value) {
  try {
    return new URL(value);
  } catch {
    throw new Error(`${label} is not a valid absolute URL.`);
  }
}

function databaseUrlToMariaDbConfig(databaseUrl) {
  const url = new URL(databaseUrl);

  if (!["mysql:", "mariadb:"].includes(url.protocol)) {
    throw new Error(
      `Unsupported database protocol "${url.protocol}". Use mysql:// or mariadb://.`
    );
  }

  return {
    database: url.pathname.replace(/^\//, ""),
    host: url.hostname,
    password: decodeURIComponent(url.password),
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username)
  };
}

async function checkTargetDatabase() {
  const prisma = new PrismaClient({
    adapter: new PrismaMariaDb(process.env["DATABASE_URL"])
  });

  try {
    await prisma.$queryRawUnsafe("SELECT 1");
  } finally {
    await prisma.$disconnect();
  }
}

async function checkLegacyDatabase(legacyDatabaseUrl) {
  const connection = await mariadb.createConnection(
    databaseUrlToMariaDbConfig(legacyDatabaseUrl)
  );

  try {
    await connection.query("SELECT 1 AS ok");
  } finally {
    await connection.end();
  }
}

async function main() {
  console.log("Cutover preflight");
  console.log("=================");

  let failed = false;

  for (const name of REQUIRED_ENV_NAMES) {
    const value = process.env[name];

    if (!isNonEmptyString(value)) {
      failed = true;
      printResult(name, false, "Missing required env var.");
      continue;
    }

    printResult(name, true, "Present");
  }

  if (isNonEmptyString(process.env["NEXTAUTH_URL"])) {
    try {
      validateUrl("NEXTAUTH_URL", process.env["NEXTAUTH_URL"]);
      printResult("NEXTAUTH_URL format", true, process.env["NEXTAUTH_URL"]);
    } catch (error) {
      failed = true;
      printResult(
        "NEXTAUTH_URL format",
        false,
        error instanceof Error ? error.message : "Invalid NEXTAUTH_URL."
      );
    }
  }

  if (isNonEmptyString(process.env["NEXTAUTH_SECRET"])) {
    const secretLength = process.env["NEXTAUTH_SECRET"].trim().length;

    if (secretLength < 32) {
      printWarning(
        "NEXTAUTH_SECRET strength",
        `Current length is ${secretLength}. Recommended >= 32 characters.`
      );
    } else {
      printResult("NEXTAUTH_SECRET strength", true, `Length ${secretLength}`);
    }
  }

  if (isNonEmptyString(process.env["APP_STAGE"])) {
    printResult("APP_STAGE", true, process.env["APP_STAGE"]);
  } else {
    printWarning("APP_STAGE", "Missing. Default runtime stage will be derived from NODE_ENV.");
  }

  if (isNonEmptyString(process.env["APP_RELEASE"])) {
    printResult("APP_RELEASE", true, process.env["APP_RELEASE"]);
  } else {
    printWarning("APP_RELEASE", "Missing. Health/readiness will not expose a release marker.");
  }

  if (!failed) {
    try {
      await checkTargetDatabase();
      printResult("Target database", true, "Connection ok");
    } catch (error) {
      failed = true;
      printResult(
        "Target database",
        false,
        error instanceof Error ? error.message : "Connection failed."
      );
    }
  }

  if (isNonEmptyString(process.env["LEGACY_DATABASE_URL"])) {
    try {
      await checkLegacyDatabase(process.env["LEGACY_DATABASE_URL"]);
      printResult("Legacy database", true, "Connection ok");
    } catch (error) {
      failed = true;
      printResult(
        "Legacy database",
        false,
        error instanceof Error ? error.message : "Connection failed."
      );
    }
  } else {
    printWarning(
      "LEGACY_DATABASE_URL",
      "Missing. Legacy import and final cutover migration can not be verified."
    );
  }

  console.log("");
  console.log(
    failed
      ? "Preflight failed. Fix the items above before staging deploy/cutover."
      : "Preflight passed. Environment and databases look ready for staging/cutover."
  );

  process.exitCode = failed ? 1 : 0;
}

main().catch((error) => {
  console.error("");
  console.error("Cutover preflight failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
