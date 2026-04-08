import "server-only";

import { Prisma } from "@prisma/client";
import type { ProfileFormInput } from "@/features/profile/schemas/profile-schemas";
import { getPrismaClient } from "@/lib/db/prisma";

export type UpdateProfileResult =
  | {
      status: "not_found";
    }
  | {
      status: "email_taken";
    }
  | {
      status: "success";
      user: {
        avatarPath: string | null;
        email: string;
        locale: string;
        name: string;
        timezone: string;
      };
    };

export async function updateProfileForUser(
  userId: bigint,
  input: ProfileFormInput
): Promise<UpdateProfileResult> {
  const prisma = getPrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!user) {
    return {
      status: "not_found"
    };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        avatarPath: input.avatarPath || null,
        email: input.email,
        locale: input.locale,
        name: input.name,
        timezone: input.timezone
      },
      select: {
        avatarPath: true,
        email: true,
        locale: true,
        name: true,
        timezone: true
      }
    });

    return {
      status: "success",
      user: {
        avatarPath: updatedUser.avatarPath ?? null,
        email: updatedUser.email,
        locale: updatedUser.locale,
        name: updatedUser.name,
        timezone: updatedUser.timezone
      }
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        status: "email_taken"
      };
    }

    throw error;
  }
}
