import { NextResponse } from "next/server";
import {
  getDeploymentRelease,
  getDeploymentStage
} from "@/lib/env";

export async function GET() {
  return NextResponse.json(
    {
      service: "quan-ly-muc-tieu-ca-nhan-next",
      status: "ok",
      stage: getDeploymentStage(),
      release: getDeploymentRelease(),
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
