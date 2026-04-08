import { Button } from "@/components/ui/button";
import { markNotificationReadAction } from "@/features/notifications/actions/mark-notification-read";

export function MarkNotificationReadForm({
  notificationId,
  isRead
}: {
  notificationId: string;
  isRead: boolean;
}) {
  if (isRead) {
    return null;
  }

  return (
    <form action={markNotificationReadAction}>
      <input name="notificationId" type="hidden" value={notificationId} />
      <Button type="submit" variant="secondary">
        Danh dau da doc
      </Button>
    </form>
  );
}
