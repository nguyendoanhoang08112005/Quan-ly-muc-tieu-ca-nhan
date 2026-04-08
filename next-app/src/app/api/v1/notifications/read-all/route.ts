import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  getApiAuthenticatedUser,
  jsonUnauthorizedResponse
} from "@/lib/api/v1/route-helpers";
import { serializeNotificationSummaryResource } from "@/lib/api/v1/serializers";
import { markAllNotificationsAsReadForUser } from "@/server/modules/notifications/mutations";
import { getNotificationSummaryForUser } from "@/server/modules/notifications/queries";

export async function POST(request: Request) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  await markAllNotificationsAsReadForUser(auth.userId);
  const summary = await getNotificationSummaryForUser(auth.userId);

  revalidatePath("/notifications");
  revalidatePath("/dashboard");

  return NextResponse.json({
    message: "Đã đánh dấu tất cả notification là đã đọc.",
    summary: serializeNotificationSummaryResource(summary)
  });
}
