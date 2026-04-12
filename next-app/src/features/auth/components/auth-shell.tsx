import Link from "next/link";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  ArrowLeft,
  BellRing,
  CheckCircle2,
  Clock3,
  LayoutPanelTop,
  NotebookPen,
  Sparkles,
  Tags,
  Target,
  TimerReset
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"]
});

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  mode: "login" | "register";
};

const shellMood = {
  login: {
    badge: "Quay lại đúng nhịp",
    lead: "Vào lại là thấy phần đang dở.",
    supporting:
      "Board, mục tiêu, streak và ghi chú vẫn nằm đúng chỗ để bạn tiếp tục ngay.",
    accent: "bg-[#fff4ee] text-[#b76349] border-[#f1ddd3]",
    surface:
      "bg-[radial-gradient(circle_at_top_left,rgba(246,199,182,0.26),transparent_26%),linear-gradient(180deg,#ffffff_0%,#fcf8f5_100%)]",
    tiles: [
      {
        title: "Việc đang chạy",
        body: "Hoàn thiện dashboard",
        note: "Đang làm · 18:00 hôm nay",
        className: "border-[#f1dfdb] bg-[#fff8f7]"
      },
      {
        title: "Mục tiêu tuần",
        body: "Ra mắt phiên bản mới",
        note: "3/5 cột mốc đã xong",
        className: "border-[#ece7e1] bg-white"
      },
      {
        title: "Nhịp quay lại",
        body: "6 ngày streak",
        note: "Vẫn giữ được nhịp",
        className: "border-[#e6efd9] bg-[#f7fbf2]"
      },
      {
        title: "Ghi chú gần nhất",
        body: "Ý tưởng cho landing",
        note: "Note lại để làm tiếp",
        className: "border-[#ece7e1] bg-white"
      }
    ],
    mascot: "cat" as const,
    formBadge: "Tiếp tục",
    formHighlights: [
      { label: "Board", value: "Gần nhất" },
      { label: "Mục tiêu", value: "Đang mở" },
      { label: "Nhịp", value: "Không đứt đoạn" }
    ]
  },
  register: {
    badge: "Bắt đầu nhẹ",
    lead: "Tạo tài khoản rồi dựng nhịp đầu tiên.",
    supporting:
      "Mục tiêu, việc và thói quen đi cùng nhau ngay từ đầu, không cần mở nhiều màn rời rạc.",
    accent: "bg-[#fff2f8] text-[#a86083] border-[#ecdce7]",
    surface:
      "bg-[radial-gradient(circle_at_top_left,rgba(245,215,231,0.28),transparent_26%),linear-gradient(180deg,#ffffff_0%,#fdf8fb_100%)]",
    tiles: [
      {
        title: "Mục tiêu đầu tiên",
        body: "Học đều 30 ngày",
        note: "Chia thành từng chặng nhỏ",
        className: "border-[#eadbe6] bg-[#fff7fb]"
      },
      {
        title: "Board đầu ngày",
        body: "1 việc quan trọng",
        note: "Nhìn là biết phải làm gì",
        className: "border-[#f1dfdb] bg-[#fff8f7]"
      },
      {
        title: "Thói quen nhỏ",
        body: "Đọc 15 phút",
        note: "Giữ đều thay vì quá sức",
        className: "border-[#e6efd9] bg-[#f7fbf2]"
      },
      {
        title: "Ghi chú nhanh",
        body: "Mục tiêu tuần này",
        note: "Lên ý tưởng ngay khi cần",
        className: "border-[#ece7e1] bg-white"
      }
    ],
    mascot: "rabbit" as const,
    formBadge: "Khởi tạo",
    formHighlights: [
      { label: "Mục tiêu", value: "Chia theo chặng" },
      { label: "Việc", value: "Kéo đúng cột" },
      { label: "Thói quen", value: "Giữ nhịp nhỏ" }
    ]
  }
} as const;

const featureRailLeft = [
  { icon: Target, label: "Mục tiêu" },
  { icon: LayoutPanelTop, label: "Task board" },
  { icon: NotebookPen, label: "Ghi chú" },
  { icon: BellRing, label: "Nhắc việc" }
];

const featureRailRight = [
  { icon: TimerReset, label: "Pomodoro" },
  { icon: Tags, label: "Thẻ" },
  { icon: Clock3, label: "Deadline" },
  { icon: CheckCircle2, label: "Thói quen" }
];

function PandaMiniMascot() {
  return (
    <div className="relative h-20 w-16">
      <div className="absolute left-2 top-0 h-4 w-4 rounded-full bg-[#232323]" />
      <div className="absolute right-2 top-0 h-4 w-4 rounded-full bg-[#232323]" />
      <div className="absolute left-1/2 top-2 h-10 w-10 -translate-x-1/2 rounded-full bg-[#fffdf8]" />
      <div className="absolute left-[1.15rem] top-[1.35rem] h-3.5 w-3 -rotate-[10deg] rounded-full bg-[#232323]" />
      <div className="absolute right-[1.15rem] top-[1.35rem] h-3.5 w-3 rotate-[10deg] rounded-full bg-[#232323]" />
      <div className="absolute left-1/2 top-[2.45rem] h-1.5 w-2 -translate-x-1/2 rounded-full bg-[#232323]" />
      <div className="absolute bottom-0 left-1/2 h-9 w-10 -translate-x-1/2 rounded-[46%] bg-[#232323]" />
      <div className="absolute bottom-1 left-1/2 h-6 w-6 -translate-x-1/2 rounded-[46%] bg-[#fffdf8]" />
      <div className="absolute right-0 top-[2.75rem] flex rotate-[-18deg] gap-0.5">
        <span className="h-6 w-1.5 rounded-full bg-[#90b56f]" />
        <span className="mt-1 h-5 w-1.5 rounded-full bg-[#79a15b]" />
      </div>
    </div>
  );
}

function CatMiniMascot() {
  return (
    <div className="relative h-20 w-16">
      <div className="absolute left-2.5 top-1 h-4 w-4 rotate-45 rounded-sm bg-[#f4b9a2]" />
      <div className="absolute right-2.5 top-1 h-4 w-4 rotate-45 rounded-sm bg-[#f4b9a2]" />
      <div className="absolute left-1/2 top-2 h-10 w-10 -translate-x-1/2 rounded-full bg-[#ffd7c8]" />
      <div className="absolute left-[1.15rem] top-[1.8rem] h-1.5 w-1.5 rounded-full bg-[#1f1c1a]" />
      <div className="absolute right-[1.15rem] top-[1.8rem] h-1.5 w-1.5 rounded-full bg-[#1f1c1a]" />
      <div className="absolute left-1/2 top-[2.35rem] h-1.5 w-1.5 -translate-x-1/2 rotate-45 rounded-sm bg-[#eb8e73]" />
      <div className="absolute bottom-0 left-1/2 h-9 w-10 -translate-x-1/2 rounded-[46%] bg-[#f4b9a2]" />
      <div className="absolute bottom-0 right-0 h-9 w-5 rounded-full border-[5px] border-l-0 border-[#eb8e73] bg-transparent" />
    </div>
  );
}

function RabbitMiniMascot() {
  return (
    <div className="relative h-20 w-16">
      <div className="absolute left-[1.05rem] top-0 h-6 w-3 rounded-full bg-[#f6dce8]" />
      <div className="absolute right-[1.05rem] top-0 h-6 w-3 rounded-full bg-[#f6dce8]" />
      <div className="absolute left-1/2 top-3 h-10 w-10 -translate-x-1/2 rounded-full bg-[#fff8fc]" />
      <div className="absolute left-[1.15rem] top-[1.9rem] h-1.5 w-1.5 rounded-full bg-[#1f1c1a]" />
      <div className="absolute right-[1.15rem] top-[1.9rem] h-1.5 w-1.5 rounded-full bg-[#1f1c1a]" />
      <div className="absolute left-1/2 top-[2.45rem] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#f29a52]" />
      <div className="absolute bottom-0 left-1/2 h-8 w-10 -translate-x-1/2 rounded-[46%] bg-[#fff0f7]" />
    </div>
  );
}

function MascotOrnament({
  mascot,
  className
}: {
  mascot: "panda" | "cat" | "rabbit";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute hidden h-14 w-14 items-center justify-center rounded-[18px] border border-white/80 bg-white/92 backdrop-blur md:flex lg:h-16 lg:w-16",
        "shadow-[rgba(17,24,39,0.08)_0px_10px_26px_-18px,rgba(17,24,39,0.08)_0px_1px_1px]",
        className
      )}
    >
      {mascot === "panda" ? <PandaMiniMascot /> : mascot === "cat" ? <CatMiniMascot /> : <RabbitMiniMascot />}
    </div>
  );
}

function FeatureGlyph({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex min-h-[4.75rem] flex-col items-center justify-center gap-2 rounded-[16px] border border-[#ece7e1] bg-white/86 px-2 py-3 text-center backdrop-blur">
      <Icon className="h-4 w-4 text-[#6b645d]" />
      <span className="text-[11px] font-medium leading-tight text-[#6b645d]">{label}</span>
    </div>
  );
}

function AuthPreviewWall({ mode }: { mode: AuthShellProps["mode"] }) {
  const mood = shellMood[mode];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2.3rem] border border-[#ece7e1] p-5 sm:p-6",
        mood.surface
      )}
    >
      <MascotOrnament className="left-4 top-4 lg:left-5 lg:top-5" mascot="panda" />
      <MascotOrnament className="right-4 top-4 lg:right-5 lg:top-5" mascot={mood.mascot} />

      <div className="mx-auto max-w-[620px] pt-2 text-center md:px-10 xl:px-0">
        <span className={cn("inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", mood.accent)}>
          {mood.badge}
        </span>
        <h1 className="mx-auto mt-4 max-w-[580px] text-balance text-[1.95rem] font-extrabold leading-[1.03] tracking-[-0.05em] text-[#1f1c1a] sm:text-[2.2rem] lg:text-[2.45rem] xl:text-[2.7rem]">
          {mood.lead}
        </h1>
        <p className="mx-auto mt-3 max-w-[540px] text-sm leading-7 text-[#6b645d] sm:text-base">
          {mood.supporting}
        </p>
      </div>

      <div className="mt-6 rounded-[1.9rem] border border-white/80 bg-white/88 p-4 shadow-[rgba(17,24,39,0.08)_0px_16px_40px_-28px] sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[7rem_minmax(0,1fr)_7rem] xl:items-center">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-1">
            {featureRailLeft.map((item) => (
              <FeatureGlyph key={item.label} icon={item.icon} label={item.label} />
            ))}
          </div>

          <div className="mx-auto w-full max-w-[30rem] rounded-[1.7rem] border border-[#ece7e1] bg-[linear-gradient(180deg,#ffffff_0%,#faf9fb_100%)] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", mode === "login" ? "bg-[#fff1ea] text-[#b05d42]" : "bg-[#fff1f8] text-[#ab6788]")}>
                {mode === "login" ? "Quay lại đúng chỗ" : "Bắt đầu vừa sức"}
              </span>
              <span className="rounded-full border border-[#ece7e1] bg-white px-3 py-1 text-xs font-semibold text-[#6b645d]">
                {mode === "login" ? "Hôm nay" : "Ngày đầu"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {mood.tiles.map((tile) => (
                <div
                  key={tile.title}
                  className={cn("rounded-[1.2rem] border p-4", tile.className)}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b645d]">
                    {tile.title}
                  </p>
                  <p className="mt-2 text-base font-bold leading-tight text-[#1f1c1a]">
                    {tile.body}
                  </p>
                  <p className="mt-2 text-sm text-[#7a736c]">{tile.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-1">
            {featureRailRight.map((item) => (
              <FeatureGlyph key={item.label} icon={item.icon} label={item.label} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  mode
}: AuthShellProps) {
  const mood = shellMood[mode];

  return (
    <main className={cn(bodyFont.className, "min-h-screen bg-white px-6 py-10 lg:px-8 lg:py-12")}>
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_34rem] xl:grid-cols-[minmax(0,1fr)_36rem]">
        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[#ece7e1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b645d] transition hover:bg-[#faf9f8]"
              href="/"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Về trang chủ
            </Link>
          </div>

          <AuthPreviewWall mode={mode} />
        </section>

        <section className="relative self-start overflow-hidden rounded-[2.3rem] border border-[#ece7e1] bg-[linear-gradient(180deg,#ffffff_0%,#fcfbfa_100%)] p-6 shadow-[rgba(17,24,39,0.08)_0px_24px_54px_-34px] lg:p-7">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-28 rounded-b-[2rem] bg-[radial-gradient(circle_at_top,rgba(248,243,238,0.95),transparent_72%)]" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ece7e1] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b645d]">
                <Sparkles className="h-3.5 w-3.5" />
                {eyebrow}
              </div>
              <span className="inline-flex rounded-full border border-[#ece7e1] bg-[#faf8f6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a736c]">
                {mood.formBadge}
              </span>
            </div>

            <h2 className="mt-5 text-[2rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#1f1c1a]">
              {title}
            </h2>
            <p className="mt-3 max-w-[30rem] text-sm leading-7 text-[#6b645d]">
              {description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {mood.formHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.2rem] border border-[#ece7e1] bg-white/92 px-4 py-3"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a837c]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#1f1c1a]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.8rem] border border-[#ece7e1] bg-white p-4 shadow-[rgba(17,24,39,0.05)_0px_14px_34px_-28px] sm:p-5">
              {children}
            </div>
          </div>

          <div className="relative mt-6 border-t border-[#ece7e1] pt-5 text-sm text-[#6b645d]">
            {footer}
          </div>
        </section>
      </div>
    </main>
  );
}
