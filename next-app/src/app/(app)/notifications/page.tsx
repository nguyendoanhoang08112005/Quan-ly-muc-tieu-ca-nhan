import Link from "next/link";
import type { Route } from "next";
import { Bell, ArrowRight } from "lucide-react";
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
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
              Phase 8
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
              Notification center
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Notification center tap trung vao unread state, recent events va
              dieu huong nhanh toi entity lien quan.
            </p>
          </div>

          <MarkAllNotificationsReadForm disabled={summary.unread === 0} />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Tong notifications
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {summary.total}
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
              Chua doc
            </div>
            <div className="mt-2 text-4xl font-black">{summary.unread}</div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Da doc
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {summary.read}
            </div>
          </div>
        </div>
      </section>

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
                      {notification.isRead ? "Da doc" : "Chua doc"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black text-stone-950">
                    {notification.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {notification.body ?? "Khong co mo ta bo sung."}
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Tao luc {formatDisplayDateTime(notification.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {notification.href ? (
                    <Link
                      className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
                      href={notification.href as Route}
                    >
                      Mo lien ket
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
        <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <Bell className="h-8 w-8 text-stone-500" />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-stone-950">
            Chua co notification nao
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            Notification moi se xuat hien o day khi he thong bat dau ghi nhan
            cac su kien nhu pomodoro session hoan thanh.
          </p>
        </section>
      )}
    </div>
  );
}
