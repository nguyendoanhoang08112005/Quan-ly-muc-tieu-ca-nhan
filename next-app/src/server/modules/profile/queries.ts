import "server-only";

import type { ProfileSummary } from "@/features/profile/types";
import { getPrismaClient } from "@/lib/db/prisma";

export async function getProfileSummaryForUser(
  userId: bigint
): Promise<ProfileSummary | null> {
  const prisma = getPrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarPath: true,
      timezone: true,
      locale: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    avatarPath: user.avatarPath ?? null,
    timezone: user.timezone,
    locale: user.locale as ProfileSummary["locale"],
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
}
