"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { markNotificationAsReadForUser } from "@/server/modules/notifications/mutations";

export async function markNotificationReadAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const notificationId = formData.get("notificationId");

  if (typeof notificationId !== "string" || notificationId.trim() === "") {
    return;
  }

  await markNotificationAsReadForUser(userId, notificationId);

  revalidatePath("/notifications");
}
