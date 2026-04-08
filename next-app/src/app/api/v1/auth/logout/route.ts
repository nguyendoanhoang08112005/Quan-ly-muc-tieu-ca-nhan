import { NextResponse } from "next/server";
import {
  getApiAuthenticatedUser,
  jsonUnauthorizedResponse
} from "@/lib/api/v1/route-helpers";
import { revokeApiTokenForUser } from "@/lib/api/v1/token";

export async function POST(request: Request) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  await revokeApiTokenForUser(auth.userId);

  return NextResponse.json({
    message: "Đăng xuất thành công."
  });
}
