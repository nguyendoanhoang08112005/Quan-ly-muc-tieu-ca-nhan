import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, Globe2, Mail, User2 } from "lucide-react";
import { PageHero } from "@/components/shared/app-page-patterns";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDateTime } from "@/lib/dates";
import { getProfileSummaryForUser } from "@/server/modules/profile/queries";

export const metadata: Metadata = {
  title: "Hồ sơ"
};

export default async function ProfileSettingsPage() {
  const userId = await requireAuthenticatedUserId();
  const profile = await getProfileSummaryForUser(userId);

  if (!profile) {
    notFound();
  }

  const facts = [
    {
      icon: User2,
      label: "Tài khoản",
      value: profile.name
    },
    {
      icon: Mail,
      label: "Email xác minh",
      value: profile.emailVerifiedAt
        ? formatDisplayDateTime(profile.emailVerifiedAt)
        : "Chưa xác minh"
    },
    {
      icon: Globe2,
      label: "Múi giờ",
      value: profile.timezone
    },
    {
      icon: BadgeCheck,
      label: "Cập nhật lần cuối",
      value: formatDisplayDateTime(profile.updatedAt)
    }
  ];

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        description="Cập nhật hồ sơ, múi giờ và ngôn ngữ để phiên đăng nhập hiển thị đúng trong toàn bộ ứng dụng."
        eyebrow="Hồ sơ"
        metrics={facts.map((fact) => ({
          label: fact.label,
          value: fact.value,
          hint: "Thông tin hiện tại"
        }))}
        title="Hồ sơ và phiên đăng nhập"
        trailVariant="stone"
      />

    <div className="grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <ProfileForm
          initialValues={{
            avatarPath: profile.avatarPath ?? "",
            email: profile.email,
            locale: profile.locale,
            name: profile.name,
            timezone: profile.timezone
          }}
        />
      </section>

      <section className="space-y-6">
        <div className="grid gap-4">
          {facts.map((fact) => {
            const Icon = fact.icon;

            return (
              <article
                className="rounded-[1.5rem] border border-stone-200 bg-white px-5 py-5 shadow-sm"
                key={fact.label}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
                      {fact.label}
                    </p>
                    <p className="mt-3 text-lg font-bold text-stone-950">
                      {fact.value}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-stone-100 p-3 text-stone-600">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
            Thông tin bổ sung
          </p>
          <dl className="mt-5 space-y-4 text-sm text-stone-600">
            <div className="flex items-start justify-between gap-4">
              <dt className="font-semibold text-stone-700">Mã người dùng</dt>
              <dd className="text-right font-mono text-xs text-stone-500">
                {profile.id}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-semibold text-stone-700">Ngày tạo</dt>
              <dd>{formatDisplayDateTime(profile.createdAt)}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-semibold text-stone-700">Ngôn ngữ</dt>
              <dd>{profile.locale}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-semibold text-stone-700">
                Đường dẫn ảnh đại diện
              </dt>
              <dd className="max-w-[16rem] break-all text-right">
                {profile.avatarPath ?? "Chưa cài đặt"}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div></div>
  );
}
