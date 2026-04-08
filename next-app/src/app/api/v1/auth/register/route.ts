import { NextResponse } from "next/server";
import { registerSchema } from "@/features/auth/schemas/auth-schemas";
import { hashPassword } from "@/lib/auth/password";
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

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error, "Du lieu dang ky chua hop le.");
  }

  const prisma = getPrismaClient();
  const existingUser = await prisma.user.findUnique({
    where: {
      email: parsed.data.email
    },
    select: {
      id: true
    }
  });

  if (existingUser) {
    return NextResponse.json(
      {
        message: "Email nay da duoc su dung.",
        errors: {
          email: ["Email nay da duoc su dung."]
        }
      },
      {
        status: 422
      }
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      locale: "vi",
      name: parsed.data.name,
      password: passwordHash,
      timezone: "Asia/Ho_Chi_Minh"
    },
    select: {
      id: true
    }
  });
  const token = await issueApiTokenForUser(user.id);
  const profile = await getProfileSummaryForUser(user.id);

  if (!profile) {
    return jsonBadRequestResponse("Khong the tai profile sau dang ky.");
  }

  return NextResponse.json(
    {
      message: "Dang ky thanh cong.",
      token,
      user: serializeUserResource(profile)
    },
    {
      status: 201
    }
  );
}
