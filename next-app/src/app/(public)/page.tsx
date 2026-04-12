import type { Metadata } from "next";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  FolderOpenDot,
  LayoutPanelTop,
  NotebookPen,
  PawPrint,
  Sparkles,
  Tags,
  Target,
  TimerReset
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { getServerAuthSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "Trang chủ mới theo hướng Figma: nav mảnh, hero lớn, mockup làm trung tâm và động vật chỉ làm accent."
};

const surfaceShadow =
  "shadow-[rgba(15,23,42,0.03)_0px_0px_0px_1px,rgba(15,23,42,0.04)_0px_10px_30px,rgba(15,23,42,0.08)_0px_18px_40px_-24px]";

const heroStats = [
  { value: "3 chặng", label: "mục tiêu đang mở" },
  { value: "1 việc focus", label: "trong board hôm nay" },
  { value: "6 ngày streak", label: "vẫn giữ được nhịp" }
];

const modules = [
  {
    icon: Target,
    title: "Mục tiêu rõ",
    text: "Chia đích lớn thành từng chặng và xem tiến độ thật nhanh.",
    accent: "bg-[#eef5ff] text-[#4f46e5]"
  },
  {
    icon: LayoutPanelTop,
    title: "Board gọn",
    text: "Thả việc đúng cột, thêm nhanh ở đúng chỗ, ít thao tác vòng.",
    accent: "bg-[#fff1f5] text-[#e11d48]"
  },
  {
    icon: TimerReset,
    title: "Quay lại nhẹ",
    text: "Thói quen và nhịp dùng được giữ đủ mềm để không ngán mở app.",
    accent: "bg-[#f4f8ec] text-[#5f7a34]"
  }
];

const featureWallLeft = [
  { icon: Target, label: "Mục tiêu" },
  { icon: LayoutPanelTop, label: "Task board" },
  { icon: NotebookPen, label: "Ghi chú" },
  { icon: BellRing, label: "Nhắc việc" },
  { icon: Tags, label: "Thẻ" },
  { icon: BarChart3, label: "Tiến độ" }
];

const featureWallRight = [
  { icon: CalendarDays, label: "Lịch" },
  { icon: FolderKanban, label: "Dự án" },
  { icon: TimerReset, label: "Pomodoro" },
  { icon: FolderOpenDot, label: "Danh mục" },
  { icon: Clock3, label: "Deadline" },
  { icon: CheckCircle2, label: "Thói quen" }
];

function PandaMascotArt() {
  return (
    <div className="relative h-40 w-32">
      <div className="absolute left-4 top-1 h-8 w-8 rounded-full bg-[#232323]" />
      <div className="absolute right-4 top-1 h-8 w-8 rounded-full bg-[#232323]" />
      <div className="absolute left-1/2 top-4 h-20 w-20 -translate-x-1/2 rounded-full bg-[#fffdf9]" />
      <div className="absolute left-[2.2rem] top-[2.7rem] h-7 w-5 rotate-[18deg] rounded-full bg-[#232323]" />
      <div className="absolute right-[2.2rem] top-[2.7rem] h-7 w-5 -rotate-[18deg] rounded-full bg-[#232323]" />
      <div className="absolute left-[2.8rem] top-[3.5rem] h-2 w-2 rounded-full bg-white" />
      <div className="absolute right-[2.8rem] top-[3.5rem] h-2 w-2 rounded-full bg-white" />
      <div className="absolute left-1/2 top-[4.7rem] h-2.5 w-3 -translate-x-1/2 rounded-full bg-[#232323]" />
      <div className="absolute bottom-2 left-1/2 h-20 w-20 -translate-x-1/2 rounded-[45%] bg-[#232323]" />
      <div className="absolute bottom-4 left-1/2 h-14 w-12 -translate-x-1/2 rounded-[45%] bg-[#fffdf9]" />
      <div className="absolute bottom-5 left-3 h-7 w-7 rounded-full bg-[#232323]" />
      <div className="absolute bottom-5 right-3 h-7 w-7 rounded-full bg-[#232323]" />
      <div className="absolute right-0 top-[5.7rem] flex rotate-[-18deg] gap-1">
        <span className="h-11 w-2.5 rounded-full bg-[#90b56f]" />
        <span className="mt-2 h-9 w-2.5 rounded-full bg-[#79a15b]" />
      </div>
    </div>
  );
}

function CatMascotArt() {
  return (
    <div className="relative h-40 w-32">
      <div className="absolute left-5 top-2 h-7 w-7 rotate-45 rounded-sm bg-[#ffd2c4]" />
      <div className="absolute right-5 top-2 h-7 w-7 rotate-45 rounded-sm bg-[#ffd2c4]" />
      <div className="absolute left-1/2 top-4 h-20 w-20 -translate-x-1/2 rounded-full bg-[#ffe2d8]" />
      <div className="absolute left-[2.55rem] top-[3.6rem] h-2.5 w-2.5 rounded-full bg-[#222222]" />
      <div className="absolute right-[2.55rem] top-[3.6rem] h-2.5 w-2.5 rounded-full bg-[#222222]" />
      <div className="absolute left-1/2 top-[4.5rem] h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-[#ff6d5a]" />
      <div className="absolute bottom-2 left-1/2 h-20 w-20 -translate-x-1/2 rounded-[45%] bg-[#ffd2c4]" />
      <div className="absolute bottom-0 right-0 h-20 w-12 rounded-full border-[9px] border-l-0 border-[#ff9b86] bg-transparent" />
      <div className="absolute bottom-4 left-4 h-7 w-7 rounded-full bg-[#ffe9e1]" />
      <div className="absolute bottom-4 right-4 h-7 w-7 rounded-full bg-[#ffe9e1]" />
    </div>
  );
}

function RabbitMascotArt() {
  return (
    <div className="relative h-40 w-32">
      <div className="absolute left-[2.2rem] top-0 h-12 w-6 rounded-full bg-[#ffdbe6]" />
      <div className="absolute right-[2.2rem] top-0 h-12 w-6 rounded-full bg-[#ffdbe6]" />
      <div className="absolute left-[2.45rem] top-2 h-8 w-3.5 rounded-full bg-[#fff2f7]" />
      <div className="absolute right-[2.45rem] top-2 h-8 w-3.5 rounded-full bg-[#fff2f7]" />
      <div className="absolute left-1/2 top-6 h-20 w-20 -translate-x-1/2 rounded-full bg-[#fff8fb]" />
      <div className="absolute left-[2.55rem] top-[3.7rem] h-2.5 w-2.5 rounded-full bg-[#222222]" />
      <div className="absolute right-[2.55rem] top-[3.7rem] h-2.5 w-2.5 rounded-full bg-[#222222]" />
      <div className="absolute left-1/2 top-[4.65rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#ff9a5d]" />
      <div className="absolute bottom-2 left-1/2 h-[4.5rem] w-20 -translate-x-1/2 rounded-[48%] bg-[#fff1f7]" />
      <div className="absolute bottom-0 left-4 h-7 w-7 rounded-full bg-[#ffe4ef]" />
      <div className="absolute bottom-0 right-4 h-7 w-7 rounded-full bg-[#ffe4ef]" />
      <div className="absolute left-1/2 top-2 flex -translate-x-1/2 gap-0.5">
        <span className="h-3 w-1 rounded-full bg-[#72b15b]" />
        <span className="h-4 w-1 rounded-full bg-[#91c978]" />
      </div>
    </div>
  );
}

function MascotBadge({
  type,
  className
}: {
  type: "panda" | "cat" | "rabbit";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute hidden h-[78px] w-[78px] items-center justify-center rounded-[24px] border border-white/80 bg-white/92 backdrop-blur md:flex",
        "shadow-[rgba(17,24,39,0.08)_0px_10px_26px_-18px,rgba(17,24,39,0.08)_0px_1px_1px]",
        className
      )}
    >
      <div className="scale-[0.38]">
        {type === "panda" ? <PandaMascotArt /> : type === "cat" ? <CatMascotArt /> : <RabbitMascotArt />}
      </div>
    </div>
  );
}

function FeatureGlyph({
  icon: Icon,
  label
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[18px] border border-[#ece7e1] bg-white/86 px-3 py-3 text-center backdrop-blur">
      <Icon className="h-4.5 w-4.5 text-[#6b645d]" />
      <span className="text-xs font-medium text-[#6b645d]">{label}</span>
    </div>
  );
}

function NavActions({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          className="inline-flex h-8 items-center justify-center rounded-[8px] bg-[#f0f0f0] px-3 text-sm font-semibold text-[#1f1f1f] transition hover:bg-[#e7e7e7]"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <SignOutButton
          className="!h-8 !w-auto rounded-[8px] bg-[#202020] px-3 text-sm !font-semibold !text-white hover:bg-[#111111]"
          variant="default"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        className="hidden h-8 items-center justify-center rounded-[8px] px-3 text-sm font-medium text-[#6b645d] transition hover:bg-[#f5f5f5] sm:inline-flex"
        href="/login"
      >
        Contact
      </Link>
      <Link
        className="inline-flex h-8 items-center justify-center rounded-[8px] bg-[#f0f0f0] px-3 text-sm font-semibold text-[#1f1f1f] transition hover:bg-[#e7e7e7]"
        href="/login"
      >
        Login
      </Link>
      <Link
        className="inline-flex h-8 items-center justify-center rounded-[8px] bg-[#202020] px-3 text-sm font-semibold text-white transition hover:bg-[#111111]"
        href="/register"
      >
        Sign Up
      </Link>
    </div>
  );
}

function HeroMockup({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[40px] border border-[#ece7e1] px-4 pb-4 pt-6 sm:px-6 sm:pb-6 sm:pt-7 lg:px-8 lg:pb-8 lg:pt-8",
        "bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.20),transparent_25%),radial-gradient(circle_at_top_right,rgba(255,77,122,0.18),transparent_26%),linear-gradient(180deg,#f9f7ff_0%,#ffffff_38%,#fbfaf9_100%)]",
        surfaceShadow
      )}
    >
      <MascotBadge className="-left-3 top-16" type="panda" />
      <MascotBadge className="right-8 top-8" type="cat" />
      <MascotBadge className="bottom-20 right-4" type="rabbit" />

      <div className="mx-auto max-w-[760px] text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-[#e8e1f7] bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b645d]">
            Planner cá nhân
          </span>
        </div>

        <h1 className="mx-auto mt-5 max-w-[760px] text-balance text-[2.35rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#1f1c1a] sm:text-[3.2rem]">
          Mọi thứ bạn cần để quản lý mục tiêu và việc trong ngày.
        </h1>

        <p className="mx-auto mt-3 max-w-[560px] text-sm leading-7 text-[#6b645d] sm:text-base">
          Chia mục tiêu thành cột mốc, kéo việc theo trạng thái, giữ nhịp thói quen
          và ghi chú lại ngay trong cùng một nơi.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#202020] px-5 text-sm font-semibold text-white transition hover:bg-[#111111]"
                href="/dashboard"
              >
                Mở bảng làm việc
                <ArrowRight className="h-4 w-4" />
              </Link>
              <SignOutButton
                className="!h-11 !w-auto rounded-[14px] border border-[#ece7e1] bg-white px-5 text-sm !font-semibold !text-[#1f1c1a] shadow-none hover:bg-[#faf9f8]"
                variant="secondary"
              />
            </>
          ) : (
            <>
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#202020] px-5 text-sm font-semibold text-white transition hover:bg-[#111111]"
                href="/register"
              >
                Tạo tài khoản
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-[14px] px-4 text-sm font-semibold text-[#6b645d] underline-offset-4 transition hover:text-[#1f1c1a] hover:underline"
                href="#modules"
              >
                Xem thêm tính năng
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-[30px] border border-white/70 bg-white/92 p-4 shadow-[rgba(17,24,39,0.08)_0px_16px_40px_-28px] sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_520px_1fr] xl:items-center">
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-2">
            {featureWallLeft.map((item) => (
              <FeatureGlyph key={item.label} icon={item.icon} label={item.label} />
            ))}
          </div>

          <div className="rounded-[30px] border border-[#ece7e1] bg-[linear-gradient(180deg,#ffffff_0%,#faf9fb_100%)] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-[#f5f1ff] px-3 py-1 text-xs font-semibold text-[#6b4eff]">
                Tất cả trong một nơi
              </span>
              <span className="rounded-full border border-[#ece7e1] bg-white px-3 py-1 text-xs font-semibold text-[#6b645d]">
                Hôm nay
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[22px] border border-[#e8e2f5] bg-[#faf7ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7569aa]">
                  Mục tiêu
                </p>
                <p className="mt-2 text-xl font-bold text-[#221b3d]">Ra mắt phiên bản mới</p>
                <div className="mt-4 h-2 rounded-full bg-white">
                  <div className="h-2 w-[62%] rounded-full bg-[#7c5cff]" />
                </div>
                <p className="mt-2 text-sm text-[#6a6480]">3/5 cột mốc đã xong</p>
              </div>

              <div className="rounded-[22px] border border-[#f1dfdb] bg-[#fff8f7] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b85e6f]">
                  Công việc
                </p>
                <div className="mt-3 space-y-2">
                  <div className="rounded-[14px] bg-white px-3 py-2">
                    <p className="text-sm font-semibold text-[#1f1c1a]">Hoàn thiện dashboard</p>
                    <p className="mt-1 text-xs text-[#8a8179]">Đang làm · 18:00 hôm nay</p>
                  </div>
                  <div className="rounded-[14px] border border-dashed border-[#efc7d3] px-3 py-2 text-sm text-[#b85e6f]">
                    + Thêm nhanh vào board
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-[#e5efda] bg-[#f7fbf2] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f8058]">
                  Thói quen
                </p>
                <div className="mt-4 flex gap-2">
                  {["on", "on", "on", "on", "on", "off", "on"].map((state, index) => (
                    <span
                      key={`${state}-${index}`}
                      className={cn(
                        "h-8 w-8 rounded-full",
                        state === "on" ? "bg-[#90b56f]" : "bg-white"
                      )}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm text-[#6a735f]">6 ngày streak vẫn giữ được.</p>
              </div>

              <div className="rounded-[22px] border border-[#ece7e1] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b645d]">
                  Ghi chú nhanh
                </p>
                <div className="mt-3 space-y-2">
                  <div className="h-2 rounded-full bg-[#ece7e1]" />
                  <div className="h-2 w-[84%] rounded-full bg-[#ece7e1]" />
                  <div className="h-2 w-[68%] rounded-full bg-[#ece7e1]" />
                </div>
                <p className="mt-3 text-sm text-[#8a8179]">Ý tưởng mới, note lại ngay trong ngày.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-2">
            {featureWallRight.map((item) => (
              <FeatureGlyph key={item.label} icon={item.icon} label={item.label} />
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {heroStats.map((item) => (
            <div
              key={item.label}
              className="rounded-[22px] border border-[#ece7e1] bg-white/84 px-4 py-3 backdrop-blur"
            >
              <p className="text-base font-bold tracking-[-0.03em] text-[#1f1c1a]">{item.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8b827b]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function PublicHomePage() {
  const session = await getServerAuthSession();
  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <main className={cn(bodyFont.className, "min-h-screen bg-white text-[#1f1c1a]")}>
      <header className="sticky top-0 z-30 border-b border-[#efebe7] bg-white/90 backdrop-blur-[10px]">
        <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-5">
          <Link className="flex items-center gap-3" href="/">
            <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[linear-gradient(135deg,#8b5cf6,#ff4d7a)] text-white">
              <PawPrint className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-[-0.02em] text-[#1f1c1a]">
                Mục tiêu cá nhân
              </p>
              <p className="text-[11px] text-[#7c736c]">planner cho từng ngày làm việc</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#6b645d] lg:flex">
            <Link className="transition hover:text-[#1f1c1a]" href="#tong-quan">
              Tổng quan
            </Link>
            <Link className="transition hover:text-[#1f1c1a]" href="#mockup">
              Mockup
            </Link>
            <Link className="transition hover:text-[#1f1c1a]" href="#modules">
              Modules
            </Link>
          </nav>

          <NavActions isAuthenticated={isAuthenticated} />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1120px] px-5 pb-20 pt-12 sm:pt-16">
        <section id="tong-quan">
          <HeroMockup isAuthenticated={isAuthenticated} />
        </section>

        <section className="mt-16" id="modules">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b645d]">
                Các khối chính
              </p>
              <h2 className="mt-2 text-[2.15rem] font-extrabold tracking-[-0.04em] text-[#1f1c1a]">
                Mỗi phần một việc rõ ràng.
              </h2>
            </div>
            <p className="max-w-[360px] text-sm leading-7 text-[#6b645d]">
              Không nhồi thêm màn phụ. Mở vào là thấy đúng thứ cần nhìn.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {modules.map((item) => (
              <article
                key={item.title}
                className={cn("rounded-[28px] border border-[#ece7e1] bg-white p-5", surfaceShadow)}
              >
                <div
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-[14px]",
                    item.accent
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-[-0.03em] text-[#1f1c1a]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#6b645d]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className={cn(
            "mt-16 grid gap-5 rounded-[36px] border border-[#ece7e1] p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]",
            "bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,77,122,0.08),transparent_24%),linear-gradient(180deg,#ffffff_0%,#fbfaf9_100%)]",
            surfaceShadow
          )}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b645d]">
              Trọng tâm mới
            </p>
            <h2 className="mt-3 max-w-[560px] text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#1f1c1a]">
              Homepage giờ là landing thật, không còn chỉ là đổi màu của bản cũ.
            </h2>
            <p className="mt-4 max-w-[520px] text-sm leading-7 text-[#6b645d]">
              Nếu hướng này đúng, mình sẽ kéo tiếp cùng cấu trúc cho dashboard,
              goals và board để cả app đi chung một ngôn ngữ.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#202020] px-6 text-sm font-semibold text-white transition hover:bg-[#111111]"
                href={isAuthenticated ? "/dashboard" : "/register"}
              >
                {isAuthenticated ? "Đi vào app" : "Tạo tài khoản"}
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#ece7e1] bg-white px-6 text-sm font-semibold text-[#1f1c1a] transition hover:bg-[#faf9f8]"
                href="/login"
              >
                Xem đăng nhập
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[24px] border border-[#ece7e1] bg-white px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#f5f1ff] p-2 text-[#6b4eff]">
                  <LayoutPanelTop className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1f1c1a]">Nav gọn hơn</p>
                  <p className="mt-1 text-sm text-[#6b645d]">Không còn search bar và category rail thừa.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-[#ece7e1] bg-white px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#fff1f5] p-2 text-[#e11d48]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1f1c1a]">Hero có trọng tâm</p>
                  <p className="mt-1 text-sm text-[#6b645d]">Headline, CTA và mockup đi thành một nhịp.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-[#ece7e1] bg-white px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#f4f8ec] p-2 text-[#5f7a34]">
                  <Clock3 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1f1c1a]">Mascot ít nhưng đúng chỗ</p>
                  <p className="mt-1 text-sm text-[#6b645d]">Chỉ treo quanh mockup và card, không phủ cả trang.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
