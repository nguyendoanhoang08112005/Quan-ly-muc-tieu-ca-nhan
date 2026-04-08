import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db/prisma";
import {
  getDeploymentRelease,
  getDeploymentStage,
  getRuntimeEnvStatus
} from "@/lib/env";

async function checkDatabaseReadiness() {
  try {
    const prisma = getPrismaClient();

    await prisma.$queryRawUnsafe("SELECT 1");

    return {
      message: "Database connection ok.",
      ok: true
    };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Database readiness check failed.",
      ok: false
    };
  }
}

export async function GET() {
  const envStatus = getRuntimeEnvStatus();
  const envCheck = {
    missing: envStatus.missing,
    ok: envStatus.missing.length === 0,
    present: envStatus.present
  };
  const databaseCheck = envCheck.ok
    ? await checkDatabaseReadiness()
    : {
        message: "Skipped because required runtime env vars are missing.",
        ok: false
      };
  const isReady = envCheck.ok && databaseCheck.ok;

  return NextResponse.json(
    {
      service: "quan-ly-muc-tieu-ca-nhan-next",
      status: isReady ? "ready" : "not_ready",
      stage: getDeploymentStage(),
      release: getDeploymentRelease(),
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseCheck,
        env: envCheck
      }
    },
    {
      headers: {
        "Cache-Control": "no-store"
      },
      status: isReady ? 200 : 503
    }
  );
}
