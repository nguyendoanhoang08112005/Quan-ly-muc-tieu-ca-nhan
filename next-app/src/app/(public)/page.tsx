import type { Metadata } from "next";
import Link from "next/link";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  HeartHandshake,
  ListTodo,
  Sparkles,
  Target
} from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { getServerAuthSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const displayFont = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["700", "800"]
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "Quản lý mục tiêu, công việc và thói quen theo phong cách gấu trúc, mèo và thỏ: tập trung hơn, vui hơn và ít khô hơn."
};

const highlights = [
  "Mục tiêu, việc làm và thói quen nằm trong cùng một không gian có cá tính",
  "Board kéo thả, quick add và dashboard không còn cảm giác admin trắng phẳng",
  "Mascot, microcopy và trạng thái giúp mở app lên thấy muốn dùng tiếp"
];

const mascotGuides = [
  {
    accent:
      "border-[#d9e7cf] bg-[linear-gradient(180deg,rgba(247,251,244,0.98)_0%,rgba(234,245,226,0.98)_100%)]",
    description:
      "Gấu trúc xuất hiện ở những nơi cần tập trung: mục tiêu, tiến độ, pomodoro và dashboard.",
    eyebrow: "Bình tĩnh",
    title: "Gấu trúc giữ nhịp"
  },
  {
    accent:
      "border-[#f1d2c9] bg-[linear-gradient(180deg,rgba(255,248,243,0.98)_0%,rgba(255,234,226,0.98)_100%)]",
    description:
      "Mèo dẫn dắt các thao tác nhanh: task board, empty state, quick add và thông báo nhỏ.",
    eyebrow: "Tinh nghịch",
    title: "Mèo tạo động lực"
  },
  {
    accent:
      "border-[#ead8e5] bg-[linear-gradient(180deg,rgba(255,249,252,0.98)_0%,rgba(245,233,241,0.98)_100%)]",
    description:
      "Thỏ giữ phần khởi đầu, habits và comeback moments để app không phán xét khi bạn hụt nhịp.",
    eyebrow: "Khởi đầu lại",
    title: "Thỏ kéo bạn quay lại"
  }
];

const flowSteps = [
  {
    description:
      "Bắt đầu từ mục tiêu, chia thành các cột mốc nhỏ để biết mình đang đi tới đâu.",
    icon: Target,
    title: "Lên kế hoạch như gấu trúc"
  },
  {
    description:
      "Chuyển từng cột mốc thành các việc cụ thể và gắn đúng ưu tiên thay vì ghi đại cho đủ.",
    icon: ListTodo,
    title: "Biến ý định thành hành động"
  },
  {
    description:
      "Giữ nhịp mỗi ngày bằng thói quen nhỏ, comeback nhẹ nhàng và không bị chì chiết vì lỡ một hôm.",
    icon: HeartHandshake,
    title: "Giữ thói quen như thỏ"
  }
];

const playfulBenefits = [
  {
    accent:
      "border-[#e5dccf] bg-[linear-gradient(180deg,rgba(255,251,245,0.98)_0%,rgba(247,240,231,0.96)_100%)]",
    label: "Hóm hỉnh vừa đủ",
    text: "Sản phẩm có cá tính mà không bị sến, vẫn làm việc nghiêm túc và rõ ràng."
  },
  {
    accent:
      "border-[#d9e7cf] bg-[linear-gradient(180deg,rgba(247,251,244,0.98)_0%,rgba(238,246,232,0.96)_100%)]",
    label: "Đáng yêu có mục đích",
    text: "Mascot không chỉ để trang trí. Chúng dẫn mắt, giảm áp lực và làm trạng thái dễ hiểu hơn."
  },
  {
    accent:
      "border-[#f1d2c9] bg-[linear-gradient(180deg,rgba(255,248,243,0.98)_0%,rgba(255,236,229,0.96)_100%)]",
    label: "Mở lên là muốn dùng",
    text: "Trang chủ, dashboard và board đều tạo cảm giác ấm, nhẹ đầu và thú vị hơn."
  }
];

const homepagePrimaryCtaClass =
  "ui-light-cta whitespace-nowrap rounded-full border border-[#ead7c7] bg-[linear-gradient(135deg,#fff4e4_0%,#ffe0d1_48%,#edf5e5_100%)] font-semibold !text-stone-950 shadow-[0_18px_36px_-24px_rgba(232,163,137,0.6)] transition hover:-translate-y-0.5 hover:brightness-[1.01]";

function PandaMascot() {
  return (
    <div className="relative h-56 w-44 shrink-0">
      <div className="absolute left-5 top-1 h-12 w-12 rounded-full bg-stone-950" />
      <div className="absolute right-5 top-1 h-12 w-12 rounded-full bg-stone-950" />
      <div className="absolute left-1/2 top-5 h-28 w-28 -translate-x-1/2 rounded-full bg-[#fffdf8] shadow-[inset_0_-10px_18px_rgba(28,25,23,0.06)]" />
      <div className="absolute left-[2.8rem] top-[3.2rem] h-9 w-7 rotate-[18deg] rounded-full bg-stone-950" />
      <div className="absolute right-[2.8rem] top-[3.2rem] h-9 w-7 -rotate-[18deg] rounded-full bg-stone-950" />
      <div className="absolute left-[3.5rem] top-[4.1rem] h-2.5 w-2.5 rounded-full bg-white" />
      <div className="absolute right-[3.5rem] top-[4.1rem] h-2.5 w-2.5 rounded-full bg-white" />
      <div className="absolute left-1/2 top-[5.4rem] h-3.5 w-4 -translate-x-1/2 rounded-full bg-stone-950" />
      <div className="absolute left-1/2 top-[6rem] h-2 w-8 -translate-x-1/2 rounded-full border-b-2 border-stone-950" />

      <div className="absolute bottom-3 left-1/2 h-32 w-32 -translate-x-1/2 rounded-[45%] bg-stone-950" />
      <div className="absolute bottom-5 left-1/2 h-24 w-20 -translate-x-1/2 rounded-[45%] bg-[#fffdf8]" />
      <div className="absolute bottom-7 left-4 h-10 w-10 rounded-full bg-stone-950" />
      <div className="absolute bottom-7 right-4 h-10 w-10 rounded-full bg-stone-950" />

      <div className="absolute right-0 top-32 flex rotate-[-18deg] gap-1">
        <span className="h-16 w-3 rounded-full bg-[#8bb174]" />
        <span className="mt-2 h-14 w-3 rounded-full bg-[#6f9b58]" />
      </div>
    </div>
  );
}

function CatMascot() {
  return (
    <div className="relative h-48 w-40 shrink-0">
      <div className="absolute left-7 top-2 h-8 w-8 rotate-45 rounded-sm bg-[#f4b9a2]" />
      <div className="absolute right-7 top-2 h-8 w-8 rotate-45 rounded-sm bg-[#f4b9a2]" />
      <div className="absolute left-1/2 top-5 h-24 w-24 -translate-x-1/2 rounded-full bg-[#ffd7c8] shadow-[inset_0_-10px_18px_rgba(235,142,115,0.14)]" />
      <div className="absolute left-[3.2rem] top-[4.4rem] h-2.5 w-2.5 rounded-full bg-stone-900" />
      <div className="absolute right-[3.2rem] top-[4.4rem] h-2.5 w-2.5 rounded-full bg-stone-900" />
      <div className="absolute left-1/2 top-[5.2rem] h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm bg-[#eb8e73]" />
      <div className="absolute left-[2.1rem] top-[5.6rem] h-px w-5 bg-[#c17761]" />
      <div className="absolute left-[2rem] top-[6.1rem] h-px w-5 bg-[#c17761]" />
      <div className="absolute right-[2.1rem] top-[5.6rem] h-px w-5 bg-[#c17761]" />
      <div className="absolute right-[2rem] top-[6.1rem] h-px w-5 bg-[#c17761]" />

      <div className="absolute bottom-3 left-1/2 h-24 w-24 -translate-x-1/2 rounded-[45%] bg-[#f4b9a2]" />
      <div className="absolute bottom-1 right-1 h-24 w-16 rounded-full border-[10px] border-l-0 border-[#eb8e73] bg-transparent" />
      <div className="absolute bottom-4 left-5 h-8 w-8 rounded-full bg-[#ffd7c8]" />
      <div className="absolute bottom-4 right-5 h-8 w-8 rounded-full bg-[#ffd7c8]" />
    </div>
  );
}

function RabbitMascot() {
  return (
    <div className="relative h-44 w-36 shrink-0">
      <div className="absolute left-[2.4rem] top-0 h-14 w-7 rounded-full bg-[#f6dce8]" />
      <div className="absolute right-[2.4rem] top-0 h-14 w-7 rounded-full bg-[#f6dce8]" />
      <div className="absolute left-[2.85rem] top-2 h-9 w-4 rounded-full bg-[#ffeef6]" />
      <div className="absolute right-[2.85rem] top-2 h-9 w-4 rounded-full bg-[#ffeef6]" />
      <div className="absolute left-1/2 top-8 h-24 w-24 -translate-x-1/2 rounded-full bg-[#fff8fc] shadow-[inset_0_-12px_18px_rgba(242,154,82,0.08)]" />
      <div className="absolute left-[2.95rem] top-[4.3rem] h-2.5 w-2.5 rounded-full bg-stone-900" />
      <div className="absolute right-[2.95rem] top-[4.3rem] h-2.5 w-2.5 rounded-full bg-stone-900" />
      <div className="absolute left-1/2 top-[5.15rem] h-3 w-3 -translate-x-1/2 rounded-full bg-[#f29a52]" />
      <div className="absolute left-1/2 top-[5.85rem] h-2 w-7 -translate-x-1/2 rounded-full border-b-2 border-[#d37b39]" />

      <div className="absolute bottom-3 left-1/2 h-22 w-24 -translate-x-1/2 rounded-[48%] bg-[#fff2f8]" />
      <div className="absolute bottom-0 left-5 h-8 w-8 rounded-full bg-[#ffe7f2]" />
      <div className="absolute bottom-0 right-5 h-8 w-8 rounded-full bg-[#ffe7f2]" />
      <div className="absolute bottom-5 right-0 rotate-[18deg] rounded-full bg-[#f29a52] px-3 py-1 text-[10px] font-black text-white shadow-sm">
        hop
      </div>
    </div>
  );
}

function WorkspacePreview() {
  return (
    <div className="overflow-hidden rounded-[2.25rem] border border-[#e8dccd] bg-[linear-gradient(180deg,rgba(255,252,246,0.98)_0%,rgba(249,243,235,0.98)_44%,rgba(245,248,239,0.98)_100%)] shadow-[0_38px_80px_-50px_rgba(120,113,108,0.55)]">
      <div className="border-b border-[#ebdecf] bg-[linear-gradient(90deg,rgba(255,248,243,0.82)_0%,rgba(247,251,244,0.85)_50%,rgba(255,247,251,0.82)_100%)] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              Không gian làm việc
            </p>
            <h2 className={cn(displayFont.className, "mt-2 text-2xl text-stone-950")}>
              Bộ ba đang canh tiến độ
            </h2>
            <p className="mt-1 text-sm leading-6 text-stone-500">
              Gấu trúc lo mục tiêu, mèo giữ board, thỏ giữ nhịp hằng ngày.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#e7f1de] px-3 py-1 text-[11px] font-semibold text-[#64844f]">
              2 việc focus
            </span>
            <span className="rounded-full bg-[#ffe5dc] px-3 py-1 text-[11px] font-semibold text-[#b05d42]">
              1 việc quá hạn
            </span>
            <span className="rounded-full bg-[#fde9f2] px-3 py-1 text-[11px] font-semibold text-[#ab6788]">
              6 ngày streak
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 bg-[linear-gradient(180deg,#fbf8f2_0%,#f8f1e8_52%,#f3f7ed_100%)] p-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.75rem] border border-[#d9e7cf] bg-[linear-gradient(180deg,rgba(248,252,245,0.98)_0%,rgba(236,246,229,0.96)_100%)] p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                Gấu trúc nhắc
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-900">
                Hôm nay chốt 1 việc quan trọng trước.
              </p>
            </div>
            <div className="rounded-full bg-[#e4efdc] px-3 py-1 text-[11px] font-semibold text-[#5f7a4b]">
              Tre focus
            </div>
          </div>

          <div className="mt-4 rounded-[1.3rem] bg-[linear-gradient(180deg,#f7fbf4_0%,#eef6e8_100%)] p-4">
            <div className="flex items-end justify-between gap-3">
              <PandaMascot />
              <div className="max-w-[9rem] rounded-[1.2rem] border border-[#d9e7cf] bg-white/80 px-3 py-3 text-xs leading-5 text-stone-600 shadow-sm">
                “Làm ít thôi cũng được. Miễn là trúng việc.”
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[1.3rem] border border-[#ead8e5] bg-[linear-gradient(180deg,rgba(255,249,252,0.96)_0%,rgba(248,238,245,0.94)_100%)] p-4">
            <div className="flex items-end justify-between gap-3">
              <div className="max-w-[10rem] rounded-[1.2rem] border border-[#ead8e5] bg-white/78 px-3 py-3 text-xs leading-5 text-stone-600 shadow-sm">
                “Lỡ một hôm cũng không sao. Nhảy lại từ hôm nay.”
              </div>
              <RabbitMascot />
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#f0d5cb] bg-[linear-gradient(180deg,rgba(255,250,247,0.98)_0%,rgba(255,239,232,0.96)_100%)] p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                Task board
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-900">
                Kéo thả như đang chơi với mèo.
              </p>
            </div>
            <div className="rounded-full bg-[#ffe8df] px-3 py-1 text-[11px] font-semibold text-[#b05d42]">
              Mèo trực chiến
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <section className="rounded-[1.25rem] border border-[#ebdecf] bg-[#fffaf5] p-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
                  Chưa bắt đầu
                </span>
                <span className="text-[10px] font-semibold text-stone-400">2</span>
              </div>
              <div className="mt-3 space-y-2">
                <article className="rounded-[1rem] border border-[#ebdecf] bg-white p-3 shadow-sm">
                  <p className="text-[11px] font-semibold text-stone-950">
                    Tạo moodboard gấu trúc
                  </p>
                  <p className="mt-1 text-[10px] text-stone-500">
                    Mốc 1 · Thiết kế lại trang chủ
                  </p>
                </article>
                <article className="rounded-[1rem] border border-[#ebdecf] bg-white p-3 shadow-sm">
                  <p className="text-[11px] font-semibold text-stone-950">
                    Viết microcopy cho mèo
                  </p>
                  <p className="mt-1 text-[10px] text-stone-500">
                    Mốc 1 · Chưa vào board
                  </p>
                </article>
              </div>
            </section>

            <section className="rounded-[1.25rem] border border-[#d9e7cf] bg-[linear-gradient(180deg,#f7fbf4_0%,#edf8ea_100%)] p-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                  Đang làm
                </span>
                <span className="text-[10px] font-semibold text-stone-400">1</span>
              </div>
              <div className="mt-3 space-y-2">
                <article className="rounded-[1rem] border border-[#d9e7cf] bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="rounded-full bg-[#fff2d6] px-1.5 py-0.5 text-[9px] font-semibold text-[#946c16]">
                      Focus
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] font-semibold text-stone-950">
                    Tối ưu task board
                  </p>
                  <p className="mt-1 text-[10px] text-stone-500">
                    Mèo đang canh cột này
                  </p>
                </article>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[1.25rem] border border-[#f3d6cd] bg-[linear-gradient(180deg,#fff7f3_0%,#ffece5_100%)] p-3">
              <div className="absolute -bottom-6 -right-6 scale-75 opacity-90">
                <CatMascot />
              </div>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Hoàn thành
                  </span>
                  <span className="text-[10px] font-semibold text-stone-400">1</span>
                </div>
                <div className="mt-3 rounded-[1rem] border border-[#f3d6cd] bg-white/90 p-3 shadow-sm">
                  <p className="text-[11px] font-semibold text-stone-950">
                    Dựng mascot đầu tiên
                  </p>
                  <p className="mt-1 text-[10px] text-stone-500">
                    Mèo nói: “Xong rồi nhé.”
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroScene() {
  return (
    <div className="relative overflow-hidden rounded-[2.4rem] border border-[#eadfd1] bg-[linear-gradient(180deg,#fff7e9_0%,#fff7f4_30%,#fff8fb_62%,#edf7e8_100%)] p-5 shadow-[0_42px_90px_-56px_rgba(120,113,108,0.56)] md:p-6">
      <div className="absolute -left-10 top-12 h-36 w-36 rounded-full bg-[#fff0bd]/70 blur-3xl" />
      <div className="absolute -right-8 top-4 h-36 w-36 rounded-full bg-[#ffdcd2]/65 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffeef6]/55 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-32 w-[82%] -translate-x-1/2 rounded-[100%] bg-[#e4efdc]/75 blur-2xl" />

      <div className="relative">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.2rem] border border-[#d9e7cf] bg-white/85 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
              Panda Mode
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-900">
              Lên mục tiêu cho ra mục tiêu
            </p>
          </div>

          <div className="rounded-[1.2rem] border border-[#f3d6cd] bg-white/85 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
              Cat Mode
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-900">
              Thả việc đúng cột rồi xử lý ngay
            </p>
          </div>

          <div className="rounded-[1.2rem] border border-[#ead8e5] bg-white/85 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
              Rabbit Mode
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-900">
              Giữ nhịp nhỏ để quay lại đều hơn
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <article className="rounded-[2rem] border border-[#d9e7cf] bg-[linear-gradient(180deg,rgba(248,252,245,0.98)_0%,rgba(237,246,230,0.96)_100%)] p-5 shadow-[0_18px_40px_-30px_rgba(111,155,88,0.48)]">
            <div className="flex min-h-[18rem] flex-col">
              <div className="rounded-[1.35rem] border border-[#d9e7cf] bg-white/82 px-4 py-3 text-sm leading-6 text-stone-600 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                  Gấu trúc bảo
                </p>
                <div className="mt-2 font-semibold text-stone-900">
                  “Đừng ôm cả khu rừng, chọn một khúc tre trước.”
                </div>
              </div>

              <div className="mt-4 flex flex-1 items-end justify-center rounded-[1.6rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78),rgba(255,255,255,0)_62%),linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(228,239,220,0.68)_100%)]">
                <PandaMascot />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.15rem] border border-[#cfe1c2] bg-white/72 px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Vai trò chính
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    Goals, progress, focus
                  </p>
                </div>
                <span className="rounded-full bg-[#e4efdc] px-3 py-1 text-[11px] font-semibold text-[#5f7a4b]">
                  Bình tĩnh
                </span>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#f3d6cd] bg-[linear-gradient(180deg,rgba(255,249,245,0.98)_0%,rgba(255,236,228,0.96)_100%)] p-5 shadow-[0_18px_40px_-30px_rgba(235,142,115,0.5)]">
            <div className="flex min-h-[18rem] flex-col">
              <div className="rounded-[1.35rem] border border-[#f3d6cd] bg-white/82 px-4 py-3 text-sm leading-6 text-stone-600 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                  Mèo bảo
                </p>
                <div className="mt-2 font-semibold text-stone-900">
                  “Kéo việc vào đây đi, đừng để mình nằm chờ.”
                </div>
              </div>

              <div className="mt-4 flex flex-1 items-end justify-center rounded-[1.6rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78),rgba(255,255,255,0)_62%),linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,232,223,0.72)_100%)]">
                <CatMascot />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.15rem] border border-[#f0cec3] bg-white/72 px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Vai trò chính
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    Board, quick add, actions
                  </p>
                </div>
                <span className="rounded-full bg-[#ffe6dc] px-3 py-1 text-[11px] font-semibold text-[#b05d42]">
                  Nhanh tay
                </span>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#ead8e5] bg-[linear-gradient(180deg,rgba(255,250,252,0.98)_0%,rgba(247,238,244,0.96)_100%)] p-5 shadow-[0_18px_40px_-30px_rgba(215,167,194,0.58)]">
            <div className="flex min-h-[18rem] flex-col">
              <div className="rounded-[1.35rem] border border-[#ead8e5] bg-white/82 px-4 py-3 text-sm leading-6 text-stone-600 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                  Thỏ bảo
                </p>
                <div className="mt-2 font-semibold text-stone-900">
                  “Lỡ một ngày thì thôi, mình nhảy tiếp ngày mai.”
                </div>
              </div>

              <div className="mt-4 flex flex-1 items-end justify-center rounded-[1.6rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78),rgba(255,255,255,0)_62%),linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,238,246,0.74)_100%)]">
                <RabbitMascot />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.15rem] border border-[#e6d1e0] bg-white/72 px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Vai trò chính
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    Habits, streak, comeback
                  </p>
                </div>
                <span className="rounded-full bg-[#fde9f2] px-3 py-1 text-[11px] font-semibold text-[#ab6788]">
                  Nhẹ đầu
                </span>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.25rem] border border-[#d9e7cf] bg-white/82 px-4 py-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
              Mục tiêu rõ
            </p>
            <p className="mt-2 text-lg font-black text-stone-950">3 chặng tre</p>
            <p className="mt-1 text-sm text-stone-500">
              chia nhỏ để không ngợp
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-[#f3d6cd] bg-white/82 px-4 py-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
              Việc trong ngày
            </p>
            <p className="mt-2 text-lg font-black text-stone-950">1 việc focus</p>
            <p className="mt-1 text-sm text-stone-500">
              ít nhưng trúng việc
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-[#ead8e5] bg-white/82 px-4 py-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
              Nhịp sử dụng
            </p>
            <p className="mt-2 text-lg font-black text-stone-950">6 ngày streak</p>
            <p className="mt-1 text-sm text-stone-500">
              hụt nhịp vẫn quay lại được
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
        {eyebrow}
      </p>
      <h2 className={cn(displayFont.className, "mt-3 text-3xl text-stone-950 md:text-4xl")}>
        {title}
      </h2>
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
        "min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,241,189,0.48),transparent_26%),radial-gradient(circle_at_top_right,rgba(255,220,210,0.38),transparent_24%),radial-gradient(circle_at_50%_12%,rgba(255,238,246,0.4),transparent_24%),linear-gradient(180deg,#fffaf3_0%,#f8f2e8_48%,#f4f3ec_100%)]"
      )}
    >
      <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
        <header className="ui-toolbar-panel overflow-hidden px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(180deg,#23201d_0%,#161311_100%)] text-white shadow-sm">
                <span className={cn(displayFont.className, "text-xl")}>P</span>
                <span className="absolute -right-1 -top-1 rounded-full bg-[#f4b9a2] px-1.5 py-0.5 text-[9px] font-bold text-stone-950">
                  C
                </span>
                <span className="absolute -bottom-1 -left-1 rounded-full bg-[#f6dce8] px-1.5 py-0.5 text-[9px] font-bold text-stone-950">
                  R
                </span>
              </div>
              <div>
                <p className={cn(displayFont.className, "text-2xl leading-none text-stone-950")}>
                  Panda Cat Rabbit Planner
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  Gấu trúc giữ mục tiêu, mèo giữ nhịp làm việc, thỏ giữ thói quen quay lại
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    className="rounded-full border border-[#dfd5c8] bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-[#d5cabd] hover:bg-white hover:text-stone-950"
                    href="/dashboard"
                  >
                    Vào dashboard
                  </Link>
                  <SignOutButton
                    className="!w-auto rounded-full bg-[linear-gradient(135deg,#2c2620_0%,#14110f_100%)] px-4 py-2 text-sm font-semibold !text-white shadow-[0_16px_30px_-20px_rgba(28,25,23,0.75)] hover:brightness-105"
                    variant="default"
                  />
                </>
              ) : (
                <>
                  <Link
                    className="rounded-full border border-[#dfd5c8] bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-[#d5cabd] hover:bg-white hover:text-stone-950"
                    href="/login"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    className={cn(homepagePrimaryCtaClass, "px-4 py-2 text-sm")}
                    href="/register"
                  >
                    Bắt đầu cùng bộ ba
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <section className="grid gap-10 py-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:py-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8e5] bg-[linear-gradient(90deg,rgba(255,255,255,0.92)_0%,rgba(255,244,249,0.92)_100%)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Bản chuyển giao diện bắt đầu từ trang chủ
            </div>
            <h1
              className={cn(
                displayFont.className,
                "mt-5 max-w-3xl text-5xl leading-[1.04] text-stone-950 md:text-6xl"
              )}
            >
              Làm việc có mục tiêu, nhưng đừng biến cuộc sống thành bảng tính.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600">
              Một không gian quản lý mục tiêu, công việc và thói quen mang tinh thần
              gấu trúc bình tĩnh, mèo tinh nghịch và thỏ kéo nhịp quay lại. Vẫn rõ
              ràng để làm việc, nhưng không còn cảm giác bảng điều khiển khô cứng.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#d9e7cf] bg-[#f3f9ee] px-3 py-1.5 text-sm font-semibold text-[#5f7a4b]">
                Panda for goals
              </span>
              <span className="rounded-full border border-[#f3d6cd] bg-[#fff2ec] px-3 py-1.5 text-sm font-semibold text-[#b05d42]">
                Cat for tasks
              </span>
              <span className="rounded-full border border-[#ead8e5] bg-[#fff3fa] px-3 py-1.5 text-sm font-semibold text-[#ab6788]">
                Rabbit for habits
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    className={cn(homepagePrimaryCtaClass, "inline-flex items-center gap-2 px-5 py-3 text-sm")}
                    href="/dashboard"
                  >
                    Vào không gian làm việc
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <SignOutButton
                    className="!w-auto rounded-full border border-[#f3d6cd] bg-[linear-gradient(180deg,#fff8f5_0%,#ffece5_100%)] px-5 py-3 text-sm font-semibold !text-stone-900 shadow-[0_10px_24px_-20px_rgba(235,142,115,0.72)] hover:brightness-105"
                    variant="secondary"
                  />
                </>
              ) : (
                <>
                  <Link
                    className={cn(homepagePrimaryCtaClass, "inline-flex items-center gap-2 px-5 py-3 text-sm")}
                    href="/register"
                  >
                    Bắt đầu cùng bộ ba
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-[#ead8e5] bg-[linear-gradient(180deg,#fffafd_0%,#fff1f7_100%)] px-5 py-3 text-sm font-semibold text-stone-900 shadow-[0_10px_24px_-18px_rgba(245,215,231,0.9)] transition hover:brightness-105"
                    href="/login"
                  >
                    Tôi đã có tài khoản
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>

            <div className="mt-7 grid gap-2 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  className="flex items-start gap-3 rounded-[1.4rem] border border-[#e7dbce] bg-[linear-gradient(180deg,rgba(255,251,246,0.95)_0%,rgba(248,242,234,0.95)_100%)] px-4 py-3 shadow-sm"
                  key={item}
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6f9b58]" />
                  <p className="text-sm leading-6 text-stone-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-2">
            <HeroScene />
          </div>
        </section>

        <section className="grid gap-4 py-4 md:grid-cols-3">
          {playfulBenefits.map((benefit) => (
            <article
              className={cn("rounded-[1.6rem] border px-5 py-5 shadow-sm", benefit.accent)}
              key={benefit.label}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                {benefit.label}
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                {benefit.text}
              </p>
            </article>
          ))}
        </section>

        <section className="py-12">
          <SectionTitle
            eyebrow="Ba mascot, ba vai trò"
            title="Mascot không chỉ đáng yêu. Chúng điều khiển nhịp của từng phần việc."
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {mascotGuides.map((item, index) => (
              <article
                className={cn("overflow-hidden rounded-[1.9rem] border p-6 shadow-sm", item.accent)}
                key={item.title}
              >
                <div className="flex h-full flex-col gap-5">
                  <div className="max-w-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                      {item.eyebrow}
                    </p>
                    <h3 className={cn(displayFont.className, "mt-3 text-3xl text-stone-950")}>
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-stone-600">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-auto flex justify-center">
                    {index === 0 ? <PandaMascot /> : index === 1 ? <CatMascot /> : <RabbitMascot />}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="py-6">
          <SectionTitle
            eyebrow="Trải nghiệm cốt lõi"
            title="Người mới vào là hiểu ngay nên làm gì, nhưng vẫn thấy sản phẩm có hồn."
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  className={cn(
                    "rounded-[1.7rem] border px-5 py-5 shadow-sm",
                    index === 0
                      ? "border-[#d9e7cf] bg-[linear-gradient(180deg,rgba(247,251,244,0.98)_0%,rgba(238,246,232,0.96)_100%)]"
                      : index === 1
                        ? "border-[#f3d6cd] bg-[linear-gradient(180deg,rgba(255,248,243,0.98)_0%,rgba(255,236,229,0.96)_100%)]"
                        : "border-[#ead8e5] bg-[linear-gradient(180deg,rgba(255,249,252,0.98)_0%,rgba(245,233,241,0.96)_100%)]"
                  )}
                  key={step.title}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-[1.25rem] text-white shadow-sm",
                        index === 0
                          ? "bg-[linear-gradient(180deg,#6f9b58_0%,#476736_100%)]"
                          : index === 1
                            ? "bg-[linear-gradient(180deg,#eb8e73_0%,#b96548_100%)]"
                            : "bg-[linear-gradient(180deg,#f29a52_0%,#c8753a_100%)]"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-400">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className={cn(displayFont.className, "mt-4 text-3xl leading-none text-stone-950")}>
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="py-8">
          <WorkspacePreview />
        </section>

        <section className="py-8">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-[#e7dbcf] bg-[linear-gradient(135deg,#fffaf1_0%,#fff2e7_38%,#fff4f7_74%,#eef7ea_100%)] text-stone-950 shadow-[0_28px_60px_-34px_rgba(120,113,108,0.34)]">
            <div className="absolute -left-14 top-0 h-40 w-40 rounded-full bg-[#6f9b58]/16 blur-3xl" />
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-[#eb8e73]/16 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-28 w-28 rounded-full bg-[#f5d7e7]/20 blur-3xl" />

            <div className="relative grid gap-7 px-6 py-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-8 lg:py-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Bắt đầu nhẹ đầu
                </p>
                <h2
                  className={cn(
                    displayFont.className,
                    "mt-3 max-w-4xl text-4xl leading-[1.03] text-stone-950 md:text-[3.3rem]"
                  )}
                >
                  Vào app là biết ngay nên ôm khúc tre nào, thả việc nào, giữ streak nào.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                  Đây là bước chuyển đầu tiên của giao diện theo hướng gấu trúc, mèo và
                  thỏ. Nếu mood này đúng, mình sẽ đẩy tiếp dashboard, goals, habits và
                  board theo cùng hệ màu và cùng ngôn ngữ.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#cfe1c2] bg-[#edf6e7] px-3 py-1 text-[11px] font-semibold text-[#5f7a4b]">
                    Panda focus
                  </span>
                  <span className="rounded-full border border-[#f0cec3] bg-[#fff0e8] px-3 py-1 text-[11px] font-semibold text-[#b05d42]">
                    Cat action
                  </span>
                  <span className="rounded-full border border-[#ead8e5] bg-[#fff1f8] px-3 py-1 text-[11px] font-semibold text-[#ab6788]">
                    Rabbit comeback
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:max-w-sm lg:justify-end">
                {isAuthenticated ? (
                  <>
                    <Link
                      className={cn(homepagePrimaryCtaClass, "px-5 py-3 text-sm")}
                      href="/dashboard"
                    >
                      Vào dashboard
                    </Link>
                    <SignOutButton
                      className="!w-auto rounded-full border border-[#e7dbcf] bg-white/72 px-5 py-3 text-sm font-semibold !text-stone-900 shadow-[0_12px_26px_-20px_rgba(120,113,108,0.4)] hover:border-[#d9ccbf] hover:bg-white"
                      variant="secondary"
                    />
                  </>
                ) : (
                  <>
                    <Link
                      className={cn(homepagePrimaryCtaClass, "px-5 py-3 text-sm")}
                      href="/register"
                    >
                      Tạo tài khoản
                    </Link>
                    <Link
                      className="rounded-full border border-[#e7dbcf] bg-white/72 px-5 py-3 text-sm font-semibold text-stone-900 shadow-[0_12px_26px_-20px_rgba(120,113,108,0.4)] transition hover:border-[#d9ccbf] hover:bg-white"
                      href="/login"
                    >
                      Đăng nhập
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
