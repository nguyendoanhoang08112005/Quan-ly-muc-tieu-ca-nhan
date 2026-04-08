import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  getApiAuthenticatedUser,
  jsonNotFoundResponse,
  jsonUnauthorizedResponse
} from "@/lib/api/v1/route-helpers";
import {
  serializeNotificationResource,
  serializeNotificationSummaryResource
} from "@/lib/api/v1/serializers";
import { markNotificationAsReadForUser } from "@/server/modules/notifications/mutations";
import {
  getNotificationSummaryForUser,
  listNotificationsForUser
} from "@/server/modules/notifications/queries";

type RouteContext = {
  params: Promise<{
    notificationId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { notificationId } = await context.params;
  const updated = await markNotificationAsReadForUser(
    auth.userId,
    notificationId
  );

  if (!updated) {
    return jsonNotFoundResponse("Khong tim thay notification chua doc.");
  }

  const [notifications, summary] = await Promise.all([
    listNotificationsForUser(auth.userId),
    getNotificationSummaryForUser(auth.userId)
  ]);
  const notification = notifications.find((item) => item.id === notificationId);

  if (!notification) {
    return jsonNotFoundResponse("Khong the tai lai notification sau cap nhat.");
  }

  revalidatePath("/notifications");
  revalidatePath("/dashboard");

  return NextResponse.json({
    message: "Da danh dau notification la da doc.",
    data: serializeNotificationResource(notification),
    summary: serializeNotificationSummaryResource(summary)
  });
}
