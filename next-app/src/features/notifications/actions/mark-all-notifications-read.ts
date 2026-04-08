"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { markAllNotificationsAsReadForUser } from "@/server/modules/notifications/mutations";

export async function markAllNotificationsReadAction() {
  const userId = await requireAuthenticatedUserId();

  await markAllNotificationsAsReadForUser(userId);

  revalidatePath("/notifications");
}
