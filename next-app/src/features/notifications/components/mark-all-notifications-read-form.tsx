import { Button } from "@/components/ui/button";
import { markAllNotificationsReadAction } from "@/features/notifications/actions/mark-all-notifications-read";

export function MarkAllNotificationsReadForm({ disabled }: { disabled: boolean }) {
  return (
    <form action={markAllNotificationsReadAction}>
      <Button disabled={disabled} type="submit" variant="secondary">
        Đánh dấu tất cả đã đọc
      </Button>
    </form>
  );
}
