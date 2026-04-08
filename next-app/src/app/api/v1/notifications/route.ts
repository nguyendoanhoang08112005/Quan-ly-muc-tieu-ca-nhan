import { NextResponse } from "next/server";
import {
  getApiAuthenticatedUser,
  jsonUnauthorizedResponse
} from "@/lib/api/v1/route-helpers";
import {
  serializeNotificationResource,
  serializeNotificationSummaryResource
} from "@/lib/api/v1/serializers";
import {
  getNotificationSummaryForUser,
  listNotificationsForUser
} from "@/server/modules/notifications/queries";

export async function GET(request: Request) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const [notifications, summary] = await Promise.all([
    listNotificationsForUser(auth.userId),
    getNotificationSummaryForUser(auth.userId)
  ]);

  return NextResponse.json({
    data: notifications.map((notification) =>
      serializeNotificationResource(notification)
    ),
    summary: serializeNotificationSummaryResource(summary)
  });
}
