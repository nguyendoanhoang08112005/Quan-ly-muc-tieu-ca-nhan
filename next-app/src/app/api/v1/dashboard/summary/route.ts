import { NextResponse } from "next/server";
import {
  getApiAuthenticatedUser,
  jsonUnauthorizedResponse
} from "@/lib/api/v1/route-helpers";
import { serializeDashboardSummaryResource } from "@/lib/api/v1/serializers";
import { getDashboardOverviewForUser } from "@/server/modules/dashboard/queries";

export async function GET() {
  const auth = await getApiAuthenticatedUser();

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const dashboard = await getDashboardOverviewForUser(auth.userId);

  return NextResponse.json(
    serializeDashboardSummaryResource(dashboard, auth.userId)
  );
}
