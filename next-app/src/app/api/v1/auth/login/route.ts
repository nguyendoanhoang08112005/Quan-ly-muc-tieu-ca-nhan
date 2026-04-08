import { NextResponse } from "next/server";
import { loginSchema } from "@/features/auth/schemas/auth-schemas";
import { verifyPassword } from "@/lib/auth/password";
import { getPrismaClient } from "@/lib/db/prisma";
import {
  jsonBadRequestResponse,
  jsonValidationErrorResponse,
  readJsonRequestBody
} from "@/lib/api/v1/route-helpers";
import { serializeUserResource } from "@/lib/api/v1/serializers";
import { issueApiTokenForUser } from "@/lib/api/v1/token";
import { getProfileSummaryForUser } from "@/server/modules/profile/queries";

export async function POST(request: Request) {
  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error, "Du lieu dang nhap chua hop le.");
  }

  const prisma = getPrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email
    },
    select: {
      id: true,
      deletedAt: true,
      password: true
    }
  });

  if (!user || user.deletedAt) {
    return NextResponse.json(
      {
        message: "Email hoac mat khau khong dung."
      },
      {
        status: 401
      }
    );
  }

  const isPasswordValid = await verifyPassword(parsed.data.password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json(
      {
        message: "Email hoac mat khau khong dung."
      },
      {
        status: 401
      }
    );
  }

  const token = await issueApiTokenForUser(user.id);
  const profile = await getProfileSummaryForUser(user.id);

  if (!profile) {
    return jsonBadRequestResponse("Không thể tải profile sau đăng nhập.");
  }

  return NextResponse.json({
    message: "Đăng nhập thành công.",
    token,
    user: serializeUserResource(profile)
  });
}
