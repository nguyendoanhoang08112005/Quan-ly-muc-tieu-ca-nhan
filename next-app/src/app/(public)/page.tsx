import type { Metadata } from "next";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  LayoutPanelTop,
  NotebookPen,
  PawPrint,
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
    "Ứng dụng quản lý mục tiêu cá nhân giúp bạn chia mục tiêu thành cột mốc, theo dõi công việc và giữ nhịp làm việc mỗi ngày."
};

const surfaceShadow =
  "shadow-[0_1px_1px_rgba(28,25,23,0.03),0_18px_38px_-28px_rgba(28,25,23,0.22)]";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f1c1a] focus-visible:ring-offset-2";

const modules = [
  {
    icon: Target,
    title: "Thấy ngay việc quan trọng",
    text: "Mục tiêu, cột mốc và trạng thái công việc nằm trong cùng một luồng thay vì phải ghép từ nhiều màn.",
    accent: "bg-[#fff1e9] text-[#ba6a4d]"
  },
  {
    icon: LayoutPanelTop,
    title: "Thêm và di chuyển rất nhanh",
    text: "Tạo việc ở đúng chỗ, kéo theo trạng thái và giữ nhịp xử lý trong ngày mà không bị ngắt đoạn.",
    accent: "bg-[#fff6f1] text-[#b8694d]"
  },
  {
    icon: TimerReset,
    title: "Quay lại mà không mất đà",
    text: "Tập trung, thói quen và ghi chú nhanh giúp bạn tiếp tục công việc mà không phải dựng lại bối cảnh từ đầu.",
    accent: "bg-[#f4f8ec] text-[#5f7a34]"
  }
];

const featureWallLeft = [
  { icon: Target, label: "Mục tiêu" },
  { icon: LayoutPanelTop, label: "Bảng việc" },
  { icon: BarChart3, label: "Tiến độ" }
];

const featureWallRight = [
  { icon: NotebookPen, label: "Ghi chú" },
  { icon: TimerReset, label: "Tập trung" },
  { icon: CheckCircle2, label: "Thói quen" }
];

const startSteps = [
  {
    step: "01",
    title: "Tạo mục tiêu",
    text: "Xác định điều bạn muốn hoàn thành và gom mọi thứ về cùng một chỗ.",
    accent: "bg-[#fff1e9] text-[#ba6a4d]"
  },
  {
    step: "02",
    title: "Chia thành cột mốc",
    text: "Bẻ nhỏ mục tiêu thành các chặng đủ rõ để theo dõi tiến độ hằng ngày.",
    accent: "bg-[#fff7e8] text-[#b7822f]"
  },
  {
    step: "03",
    title: "Kéo việc và giữ nhịp",
    text: "Làm theo trạng thái, giữ tập trung và quay lại app mà không mất đà.",
    accent: "bg-[#f4f8ec] text-[#5f7a34]"
  }
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
      aria-hidden="true"
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
    <div className="flex flex-col items-center justify-center gap-2 rounded-[18px] border border-[#e8dfd5] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] px-3 py-3 text-center">
      <Icon aria-hidden="true" className="h-4.5 w-4.5 text-[#5f5750]" />
      <span className="text-xs font-medium text-[#6b645d]">{label}</span>
    </div>
  );
}

function NavActions({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          className={cn(
            "inline-flex h-8 items-center justify-center rounded-[8px] bg-[#f0f0f0] px-3 text-sm font-semibold text-[#1f1f1f] transition hover:bg-[#e7e7e7]",
            focusRing
          )}
          href="/dashboard"
        >
          Vào ứng dụng
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
        className={cn(
          "inline-flex h-8 items-center justify-center rounded-[8px] bg-[#f0f0f0] px-3 text-sm font-semibold text-[#1f1f1f] transition hover:bg-[#e7e7e7]",
          focusRing
        )}
        href="/login"
      >
        Đăng nhập
      </Link>
      <Link
        className={cn(
          "inline-flex h-8 items-center justify-center rounded-[8px] bg-[#202020] px-3 text-sm font-semibold text-white transition hover:bg-[#111111]",
          focusRing
        )}
        href="/register"
      >
        Tạo tài khoản
      </Link>
    </div>
  );
}

function HeroMockup({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[40px] border border-[#e8dfd5] px-4 pb-4 pt-6 sm:px-6 sm:pb-6 sm:pt-7 lg:px-8 lg:pb-8 lg:pt-8",
        "bg-[radial-gradient(circle_at_top_left,rgba(255,240,231,0.95),transparent_32%),radial-gradient(circle_at_top_right,rgba(243,248,238,0.95),transparent_30%),linear-gradient(180deg,#fcfbf8_0%,#ffffff_42%,#fbfaf8_100%)]",
        surfaceShadow
      )}
    >
      <MascotBadge className="-left-3 top-16" type="panda" />
      <MascotBadge className="right-8 top-8" type="cat" />

      <div className="mx-auto max-w-[760px] text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-[#eadfd4] bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b645d]">
            Quản lý mục tiêu mỗi ngày
          </span>
        </div>

        <h1 className="mx-auto mt-5 max-w-[760px] text-balance text-[2.35rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#1f1c1a] sm:text-[3.2rem]">
          Biến mục tiêu lớn thành việc làm mỗi ngày.
        </h1>

        <p className="mx-auto mt-3 max-w-[560px] text-sm leading-7 text-[#6b645d] sm:text-base">
          Tạo mục tiêu, chia cột mốc, kéo việc theo trạng thái và giữ nhịp tập trung
          trong một giao diện gọn, dễ quay lại mỗi ngày.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#202020] px-5 text-sm font-semibold text-white transition hover:bg-[#111111]",
                  focusRing
                )}
                href="/dashboard"
              >
                Vào ứng dụng
                <ArrowRight className="h-4 w-4" />
              </Link>
              <SignOutButton
                className="!h-11 !w-auto rounded-[14px] border border-[#e8dfd5] bg-white px-5 text-sm !font-semibold !text-[#1f1c1a] shadow-none hover:bg-[#faf9f8]"
                variant="secondary"
              />
            </>
          ) : (
            <>
              <Link
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#202020] px-5 text-sm font-semibold text-white transition hover:bg-[#111111]",
                  focusRing
                )}
                href="/register"
              >
                Tạo tài khoản
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-[14px] px-4 text-sm font-semibold text-[#6b645d] underline-offset-4 transition hover:text-[#1f1c1a] hover:underline",
                  focusRing
                )}
                href="#bat-dau"
              >
                Xem cách hoạt động
              </Link>
            </>
          )}
        </div>
      </div>

      <div
        className="mt-8 rounded-[30px] border border-[#eee4da] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(252,250,248,0.96)_100%)] p-4 shadow-[0_16px_36px_-30px_rgba(28,25,23,0.22)] sm:p-6"
        id="xem-nhanh"
      >
        <div className="grid gap-4 xl:grid-cols-[0.72fr_520px_0.72fr] xl:items-center">
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {featureWallLeft.map((item) => (
              <FeatureGlyph key={item.label} icon={item.icon} label={item.label} />
            ))}
          </div>

          <div className="rounded-[30px] border border-[#eee4da] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-[#fff1e9] px-3 py-1 text-xs font-semibold text-[#ba6a4d]">
                Giao diện mẫu
              </span>
              <span className="rounded-full border border-[#e8dfd5] bg-white px-3 py-1 text-xs font-semibold text-[#6b645d]">
                Trong ngày
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-[#f0ddd4] bg-[#fff8f4] p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9d6b55]">
                  Mục tiêu
                </p>
                <p className="mt-2 text-xl font-bold text-[#2b211d]">Ra mắt phiên bản mới</p>
                <div className="mt-4 h-2 rounded-full bg-white">
                  <div className="h-2 w-[62%] rounded-full bg-[#c9795a]" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#6a6480]">
                  <span className="rounded-full bg-white px-3 py-1">3/5 cột mốc đã xong</span>
                  <span className="rounded-full bg-white px-3 py-1">2 việc ưu tiên đang mở</span>
                </div>
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
                  <div className="rounded-[14px] border border-dashed border-[#f0d4cb] px-3 py-2 text-sm text-[#b8694d]">
                    + Thêm nhanh vào đúng cột
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-[#e2ebd6] bg-[#f7fbf2] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f8058]">
                  Nhịp hôm nay
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
                <p className="mt-3 text-sm text-[#6a735f]">6 ngày giữ nhịp và vẫn còn đà quay lại.</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#6b645d]">
              Preview này mô phỏng cách app gom mục tiêu, việc đang chạy và nhịp làm việc hằng ngày vào cùng một bề mặt.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {featureWallRight.map((item) => (
              <FeatureGlyph key={item.label} icon={item.icon} label={item.label} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function PublicHomePage() {
  const session = await getServerAuthSession();
  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <main
      className={cn(
        bodyFont.className,
        "min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f6f3ee_100%)] text-[#1f1c1a]"
      )}
    >
      <header className="sticky top-0 z-30 border-b border-[#eadfd4] bg-[#fcfaf8]/90 backdrop-blur-[10px]">
        <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-5">
          <Link className={cn("flex items-center gap-3", focusRing)} href="/">
            <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[linear-gradient(135deg,#c9795a,#8faa71)] text-white">
              <PawPrint className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-[-0.02em] text-[#1f1c1a]">
                Mục tiêu cá nhân
              </p>
              <p className="text-[11px] text-[#7c736c]">mục tiêu, cột mốc và việc mỗi ngày</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#6b645d] lg:flex">
            <Link className={cn("transition hover:text-[#1f1c1a]", focusRing)} href="#tong-quan">
              Tổng quan
            </Link>
            <Link className={cn("transition hover:text-[#1f1c1a]", focusRing)} href="#tinh-nang">
              Tính năng
            </Link>
            <Link className={cn("transition hover:text-[#1f1c1a]", focusRing)} href="#bat-dau">
              Bắt đầu
            </Link>
          </nav>

          <NavActions isAuthenticated={isAuthenticated} />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1120px] px-5 pb-20 pt-12 sm:pt-16">
        <section id="tong-quan">
          <HeroMockup isAuthenticated={isAuthenticated} />
        </section>

        <section className="mt-16" id="tinh-nang">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b645d]">
                Vì sao app này gọn
              </p>
              <h2 className="mt-2 text-[2.15rem] font-extrabold tracking-[-0.04em] text-[#1f1c1a]">
                Không bắt bạn ghép lại luồng làm việc từ nhiều nơi.
              </h2>
            </div>
            <p className="max-w-[360px] text-sm leading-7 text-[#6b645d]">
              Section này không nhắc lại preview ở trên. Nó chỉ giải thích vì sao trải nghiệm trong app đỡ rối và dễ quay lại hơn.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {modules.map((item) => (
              <article
                key={item.title}
                className={cn(
                  "rounded-[28px] border border-[#e8dfd5] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] p-5",
                  surfaceShadow
                )}
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
          id="bat-dau"
          className={cn(
            "mt-16 grid gap-5 rounded-[36px] border border-[#e8dfd5] p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]",
            "bg-[radial-gradient(circle_at_top_left,rgba(255,240,231,0.78),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(243,248,238,0.78),transparent_28%),linear-gradient(180deg,#ffffff_0%,#fbfaf8_100%)]",
            surfaceShadow
          )}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b645d]">
              Bắt đầu
            </p>
            <h2 className="mt-3 max-w-[560px] text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#1f1c1a]">
              Từ mục tiêu đến việc hôm nay trong 3 bước.
            </h2>
            <p className="mt-4 max-w-[520px] text-sm leading-7 text-[#6b645d]">
              App này được làm để bạn nhìn thấy điều cần làm tiếp theo thật nhanh, thay vì phải tự ghép mục tiêu, task và nhịp làm việc từ nhiều nơi khác nhau.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-[14px] bg-[#202020] px-6 text-sm font-semibold text-white transition hover:bg-[#111111]",
                  focusRing
                )}
                href={isAuthenticated ? "/dashboard" : "/register"}
              >
                {isAuthenticated ? "Vào ứng dụng" : "Tạo tài khoản"}
              </Link>
              <Link
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-[14px] border border-[#e8dfd5] bg-white px-6 text-sm font-semibold text-[#1f1c1a] transition hover:bg-[#faf9f8]",
                  focusRing
                )}
                href="/login"
              >
                Đăng nhập
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {startSteps.map((item) => (
              <div
                className="rounded-[24px] border border-[#e8dfd5] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] px-4 py-4"
                key={item.step}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-sm font-bold",
                      item.accent
                    )}
                  >
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1f1c1a]">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#6b645d]">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
