import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { getServerAuthSession } from "@/lib/auth/session";

export async function getApiAuthenticatedUser() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return null;
  }

  return {
    session,
    user: session.user,
    userId: BigInt(session.user.id)
  };
}

export function jsonUnauthorizedResponse() {
  return NextResponse.json(
    {
      message: "Ban can dang nhap de su dung endpoint nay."
    },
    {
      status: 401
    }
  );
}

export function jsonNotFoundResponse(message = "Khong tim thay du lieu.") {
  return NextResponse.json(
    {
      message
    },
    {
      status: 404
    }
  );
}

export function jsonBadRequestResponse(message = "Yeu cau khong hop le.") {
  return NextResponse.json(
    {
      message
    },
    {
      status: 400
    }
  );
}

export function jsonValidationErrorResponse(
  error: ZodError,
  message = "Du lieu gui len chua hop le."
) {
  return NextResponse.json(
    {
      message,
      errors: error.flatten().fieldErrors
    },
    {
      status: 422
    }
  );
}

export function noContentResponse() {
  return new NextResponse(null, {
    status: 204
  });
}

export async function readJsonRequestBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function parseRouteBigIntId(value: string) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  return BigInt(value);
}
