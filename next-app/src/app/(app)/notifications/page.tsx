import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { PageEmptyState, PageHero } from "@/components/shared/app-page-patterns";
import { buttonVariants } from "@/components/ui/button";
import { MarkAllNotificationsReadForm } from "@/features/notifications/components/mark-all-notifications-read-form";
import { MarkNotificationReadForm } from "@/features/notifications/components/mark-notification-read-form";
import {
  getNotificationTypeLabel,
  relatedEntityTypeLabels
} from "@/features/notifications/notification-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import {
  getNotificationSummaryForUser,
  listNotificationsForUser
} from "@/server/modules/notifications/queries";

export default async function NotificationsPage() {
  const userId = await requireAuthenticatedUserId();
  const [summary, notifications] = await Promise.all([
    getNotificationSummaryForUser(userId),
    listNotificationsForUser(userId)
  ]);

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        actions={<MarkAllNotificationsReadForm disabled={summary.unread === 0} />}
        aside={
          <div className="rounded-[1.45rem] border border-[#eadfd4] bg-[#fffaf6] px-4 py-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              Điều hướng
            </p>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-3">
                <span>Chưa đọc</span>
                <span className="font-semibold text-stone-950">{summary.unread}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Đã đọc</span>
                <span className="font-semibold text-stone-950">{summary.read}</span>
              </div>
            </div>
          </div>
        }
        description="Thông báo tập trung vào trạng thái chưa đọc, sự kiện gần đây và điều hướng nhanh tới nội dung liên quan."
        eyebrow="Thông báo"
        metrics={[
          { label: "Tổng thông báo", value: summary.total, hint: "Toàn bộ sự kiện" },
          { label: "Chưa đọc", value: summary.unread, tone: "warm", hint: "Cần xem trước" },
          { label: "Đã đọc", value: summary.read, tone: "bamboo", hint: "Đã xử lý" }
        ]}
        title="Trung tâm thông báo"
        trailVariant="stone"
      />

      {notifications.length > 0 ? (
        <section className="grid gap-6">
          {notifications.map((notification) => (
            <article
              className={cn(
                "rounded-[2rem] border p-6 shadow-sm",
                notification.isRead
                  ? "border-stone-200 bg-white"
                  : "border-amber-200 bg-amber-50"
              )}
              key={notification.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                      {getNotificationTypeLabel(notification.type)}
                    </span>
                    {notification.relatedType ? (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                        {relatedEntityTypeLabels[notification.relatedType]}
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        notification.isRead
                          ? "bg-stone-100 text-stone-600"
                          : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {notification.isRead ? "Đã đọc" : "Chưa đọc"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black text-stone-950">
                    {notification.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {notification.body ?? "Không có mô tả bổ sung."}
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Tạo lúc {formatDisplayDateTime(notification.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {notification.href ? (
                    <Link
                      className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
                      href={notification.href as Route}
                    >
                      Mở liên kết
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                  <MarkNotificationReadForm
                    isRead={notification.isRead}
                    notificationId={notification.id}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <PageEmptyState
          description="Thông báo mới sẽ xuất hiện ở đây khi hệ thống bắt đầu ghi nhận các sự kiện như phiên pomodoro hoàn thành."
          title="Chưa có thông báo nào"
        />
      )}
    </div>
  );
}
