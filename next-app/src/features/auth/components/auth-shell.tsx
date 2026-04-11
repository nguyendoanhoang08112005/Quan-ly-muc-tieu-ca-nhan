import Link from "next/link";
import type { ReactNode } from "react";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";
import { ArrowLeft, HeartHandshake, ListTodo, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const displayFont = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["700", "800"]
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"]
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
    badge: "Cat Welcome Back",
    description:
      "Mèo mở lại board, gấu trúc giữ mục tiêu cũ, còn bạn chỉ cần quay lại nhịp đang dang dở.",
    hero:
      "Đăng nhập rồi kéo tiếp phần việc đang đợi bạn.",
    highlights: [
      {
        icon: ListTodo,
        text: "Task board, quick add và các việc đang dang dở trở lại đúng chỗ."
      },
      {
        icon: Target,
        text: "Mục tiêu và cột mốc vẫn nằm sẵn để bạn nối tiếp mà không bị lạc nhịp."
      },
      {
        icon: HeartHandshake,
        text: "Không cần bắt đầu lại từ đầu. Chỉ cần quay lại đúng một nhịp."
      }
    ],
    panel:
      "border-[#f1d4ca] bg-[linear-gradient(180deg,rgba(255,249,245,0.98)_0%,rgba(255,238,231,0.96)_100%)]",
    stat:
      "border-[#f1d4ca] bg-white/74 text-[#b05d42]"
  },
  register: {
    badge: "Rabbit First Hop",
    description:
      "Thỏ giữ phần bắt đầu, mèo kéo hành động đầu tiên, gấu trúc giúp bạn không bị ngợp ngay từ ngày đầu.",
    hero:
      "Tạo tài khoản rồi bắt đầu từng bước nhỏ nhưng có đích.",
    highlights: [
      {
        icon: HeartHandshake,
        text: "Tạo nhịp khởi đầu dễ chịu thay vì ném bạn vào một đống form và card trắng."
      },
      {
        icon: Target,
        text: "Bộ ba mascot chia rõ vai trò để app vừa vui vừa dễ hiểu ngay từ lần đầu dùng."
      },
      {
        icon: ListTodo,
        text: "Vào app là có thể lập mục tiêu, kéo việc và dựng thói quen ngay."
      }
    ],
    panel:
      "border-[#ead8e5] bg-[linear-gradient(180deg,rgba(255,250,252,0.98)_0%,rgba(247,238,244,0.96)_100%)]",
    stat:
      "border-[#ead8e5] bg-white/74 text-[#ab6788]"
  }
} as const;

function PandaMiniMascot() {
  return (
    <div className="relative h-36 w-28 shrink-0">
      <div className="absolute left-3 top-1 h-8 w-8 rounded-full bg-stone-950" />
      <div className="absolute right-3 top-1 h-8 w-8 rounded-full bg-stone-950" />
      <div className="absolute left-1/2 top-4 h-16 w-16 -translate-x-1/2 rounded-full bg-[#fffdf8]" />
      <div className="absolute left-[1.9rem] top-[2.25rem] h-5 w-4 rotate-[18deg] rounded-full bg-stone-950" />
      <div className="absolute right-[1.9rem] top-[2.25rem] h-5 w-4 -rotate-[18deg] rounded-full bg-stone-950" />
      <div className="absolute left-[2.35rem] top-[2.95rem] h-2 w-2 rounded-full bg-white" />
      <div className="absolute right-[2.35rem] top-[2.95rem] h-2 w-2 rounded-full bg-white" />
      <div className="absolute left-1/2 top-[3.9rem] h-2.5 w-3 -translate-x-1/2 rounded-full bg-stone-950" />
      <div className="absolute bottom-2 left-1/2 h-16 w-16 -translate-x-1/2 rounded-[46%] bg-stone-950" />
      <div className="absolute bottom-3 left-1/2 h-12 w-10 -translate-x-1/2 rounded-[46%] bg-[#fffdf8]" />
      <div className="absolute bottom-3 right-0 flex rotate-[-18deg] gap-1">
        <span className="h-9 w-2.5 rounded-full bg-[#8bb174]" />
        <span className="mt-2 h-8 w-2.5 rounded-full bg-[#6f9b58]" />
      </div>
    </div>
  );
}

function CatMiniMascot() {
  return (
    <div className="relative h-36 w-28 shrink-0">
      <div className="absolute left-4 top-2 h-6 w-6 rotate-45 rounded-sm bg-[#f4b9a2]" />
      <div className="absolute right-4 top-2 h-6 w-6 rotate-45 rounded-sm bg-[#f4b9a2]" />
      <div className="absolute left-1/2 top-4 h-16 w-16 -translate-x-1/2 rounded-full bg-[#ffd7c8]" />
      <div className="absolute left-[2.3rem] top-[2.9rem] h-2 w-2 rounded-full bg-stone-900" />
      <div className="absolute right-[2.3rem] top-[2.9rem] h-2 w-2 rounded-full bg-stone-900" />
      <div className="absolute left-1/2 top-[3.6rem] h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-[#eb8e73]" />
      <div className="absolute bottom-2 left-1/2 h-16 w-16 -translate-x-1/2 rounded-[46%] bg-[#f4b9a2]" />
      <div className="absolute bottom-1 right-1 h-14 w-9 rounded-full border-[8px] border-l-0 border-[#eb8e73] bg-transparent" />
    </div>
  );
}

function RabbitMiniMascot() {
  return (
    <div className="relative h-36 w-28 shrink-0">
      <div className="absolute left-[1.85rem] top-0 h-10 w-5 rounded-full bg-[#f6dce8]" />
      <div className="absolute right-[1.85rem] top-0 h-10 w-5 rounded-full bg-[#f6dce8]" />
      <div className="absolute left-[2.15rem] top-1.5 h-6 w-3 rounded-full bg-[#fff1f7]" />
      <div className="absolute right-[2.15rem] top-1.5 h-6 w-3 rounded-full bg-[#fff1f7]" />
      <div className="absolute left-1/2 top-5 h-16 w-16 -translate-x-1/2 rounded-full bg-[#fff8fc]" />
      <div className="absolute left-[2.25rem] top-[3.1rem] h-2 w-2 rounded-full bg-stone-900" />
      <div className="absolute right-[2.25rem] top-[3.1rem] h-2 w-2 rounded-full bg-stone-900" />
      <div className="absolute left-1/2 top-[3.85rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#f29a52]" />
      <div className="absolute bottom-3 left-1/2 h-14 w-16 -translate-x-1/2 rounded-[46%] bg-[#fff0f7]" />
      <div className="absolute bottom-4 right-0 rotate-[18deg] rounded-full bg-[#f29a52] px-2.5 py-1 text-[9px] font-black text-white">
        hop
      </div>
    </div>
  );
}

function AuthScene({ mode }: { mode: AuthShellProps["mode"] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div
        className={cn(
          "relative overflow-hidden rounded-[2rem] border p-5 shadow-[0_20px_45px_-30px_rgba(120,113,108,0.38)]",
          mode === "login"
            ? "border-[#f1d4ca] bg-[linear-gradient(180deg,rgba(255,248,243,0.98)_0%,rgba(255,235,228,0.96)_100%)]"
            : "border-[#ead8e5] bg-[linear-gradient(180deg,rgba(255,249,252,0.98)_0%,rgba(246,236,243,0.96)_100%)]"
        )}
      >
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
          {mode === "login" ? "Góc chào lại" : "Góc khởi đầu"}
        </p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="rounded-[1.2rem] border border-white/70 bg-white/72 px-4 py-3 text-sm leading-6 text-stone-600 shadow-sm">
              {mode === "login" ? "Mèo bảo:" : "Thỏ bảo:"}
              <div className="mt-1 font-semibold text-stone-900">
                {mode === "login"
                  ? "“Board vẫn ở đây. Kéo tiếp thôi.”"
                  : "“Bắt đầu nhẹ thôi, mình nhảy từng bước.”"}
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-white/70 bg-white/72 px-4 py-3 text-sm leading-6 text-stone-600 shadow-sm">
              Gấu trúc thêm:
              <div className="mt-1 font-semibold text-stone-900">
                “Không cần ôm hết ngay ngày đầu.”
              </div>
            </div>
          </div>

          <div className="flex items-end gap-2">
            {mode === "login" ? <CatMiniMascot /> : <RabbitMiniMascot />}
            <PandaMiniMascot />
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="rounded-[1.6rem] border border-[#e7dbcf] bg-white/76 p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Hệ nhịp mới
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            Auth không còn là một khối form trắng nhàm chán. Người dùng hiểu ngay đây là
            sản phẩm có cá tính, nhưng vẫn đủ rõ để thao tác nhanh.
          </p>
        </div>
        <div className="rounded-[1.6rem] border border-[#e7dbcf] bg-white/76 p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Từ đây đi tiếp
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#cfe1c2] bg-[#edf6e7] px-3 py-1 text-[11px] font-semibold text-[#5f7a4b]">
              Goals
            </span>
            <span className="rounded-full border border-[#f0cec3] bg-[#fff0e8] px-3 py-1 text-[11px] font-semibold text-[#b05d42]">
              Tasks
            </span>
            <span className="rounded-full border border-[#ead8e5] bg-[#fff1f8] px-3 py-1 text-[11px] font-semibold text-[#ab6788]">
              Habits
            </span>
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
    <main
      className={cn(
        bodyFont.className,
        "min-h-screen bg-[linear-gradient(180deg,#fbf8f3_0%,#f4efe8_100%)] px-6 py-10 lg:px-8 lg:py-12"
      )}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2.4rem] border border-[#e7dbcf] bg-[linear-gradient(180deg,rgba(255,251,245,0.98)_0%,rgba(248,241,232,0.96)_100%)] p-7 shadow-[0_28px_60px_-38px_rgba(120,113,108,0.4)] lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[#e0d4c7] bg-white/78 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700 shadow-sm transition hover:border-[#d2c4b5] hover:bg-white"
              href="/"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Về trang chủ
            </Link>

            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm",
                mood.stat
              )}
            >
              {mood.badge}
            </span>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
              {mode === "login" ? "Quay lại khu làm việc" : "Mở nhịp mới"}
            </p>
            <h1
              className={cn(
                displayFont.className,
                "mt-4 text-4xl leading-[1.05] text-stone-950 md:text-5xl"
              )}
            >
              {mood.hero}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">
              {mood.description}
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {mood.highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  className="rounded-[1.5rem] border border-[#e6dbcf] bg-white/72 p-4 shadow-sm"
                  key={item.text}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-stone-950 text-white shadow-sm">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-700">{item.text}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-8">
            <AuthScene mode={mode} />
          </div>
        </section>

        <section
          className={cn(
            "rounded-[2.4rem] border p-6 shadow-[0_24px_55px_-36px_rgba(120,113,108,0.42)] backdrop-blur lg:p-7",
            mood.panel
          )}
        >
          <div className="rounded-[1.8rem] border border-white/70 bg-white/78 p-6 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e6dbcf] bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {eyebrow}
              </div>
              <h2
                className={cn(
                  displayFont.className,
                  "mt-4 text-4xl leading-[1.05] text-stone-950"
                )}
              >
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">{description}</p>
            </div>

            <div className="mt-7">{children}</div>

            <div className="mt-8 border-t border-[#e9ddd0] pt-6 text-sm text-stone-600">
              {footer}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
