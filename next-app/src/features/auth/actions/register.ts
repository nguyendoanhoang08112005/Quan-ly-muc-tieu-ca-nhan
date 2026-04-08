"use server";

import { redirect } from "next/navigation";
import { getPrismaClient } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import type { RegisterActionState } from "@/features/auth/actions/register-shared";
import { authRoutes } from "@/lib/auth/routes";
import { registerSchema } from "@/features/auth/schemas/auth-schemas";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function registerWithCredentials(
  _previousState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  const prisma = getPrismaClient();
  const rawValues = {
    name: readFormValue(formData, "name"),
    email: readFormValue(formData, "email"),
    password: readFormValue(formData, "password"),
    passwordConfirmation: readFormValue(formData, "passwordConfirmation")
  };

  const parsed = registerSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Du lieu dang ky chua hop le.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: {
        name: rawValues.name,
        email: rawValues.email
      }
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: parsed.data.email
    },
    select: {
      id: true
    }
  });

  if (existingUser) {
    return {
      status: "error",
      message: "Email nay da duoc su dung.",
      fieldErrors: {
        email: ["Email nay da duoc su dung."]
      },
      values: {
        name: parsed.data.name,
        email: parsed.data.email
      }
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: passwordHash,
      timezone: "Asia/Ho_Chi_Minh",
      locale: "vi"
    }
  });

  const searchParams = new URLSearchParams({
    registered: "1",
    email: parsed.data.email
  });

  redirect(`${authRoutes.signIn}?${searchParams.toString()}`);
}
