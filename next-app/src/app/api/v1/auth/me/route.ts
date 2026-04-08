import { NextResponse } from "next/server";
import {
  getApiAuthenticatedUser,
  jsonNotFoundResponse,
  jsonUnauthorizedResponse
} from "@/lib/api/v1/route-helpers";
import { serializeUserResource } from "@/lib/api/v1/serializers";
import { getProfileSummaryForUser } from "@/server/modules/profile/queries";

export async function GET(request: Request) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const profile = await getProfileSummaryForUser(auth.userId);

  if (!profile) {
    return jsonNotFoundResponse("Không tìm thấy user hiện tại.");
  }

  return NextResponse.json({
    data: serializeUserResource(profile)
  });
}
