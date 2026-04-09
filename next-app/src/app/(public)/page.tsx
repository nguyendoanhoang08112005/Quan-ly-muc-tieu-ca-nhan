import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  Target
} from "lucide-react";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "Quản lý mục tiêu, cột mốc và công việc trong một luồng rõ ràng, gọn và dễ bắt đầu."
};

const highlights = [
  "Một nơi để theo dõi mục tiêu và công việc",
  "Kéo thả công việc trong một bảng duy nhất",
  "Bắt đầu nhanh, không bị rối bởi quá nhiều màn hình"
];

const steps = [
  {
    description:
      "Tạo mục tiêu, đặt hạn và chia nhỏ thành các cột mốc quan trọng để luôn biết mình đang đi tới đâu.",
    icon: Target,
    title: "Lên kế hoạch rõ ràng"
  },
  {
    description:
      "Biến từng cột mốc thành việc cần làm. Mọi thứ được gom về một luồng làm việc duy nhất để thao tác nhanh hơn.",
    icon: ListTodo,
    title: "Chuyển thành việc cụ thể"
  },
  {
    description:
      "Kéo thả, theo dõi việc tập trung và xử lý việc quá hạn ngay trên không gian làm việc chính.",
    icon: LayoutDashboard,
    title: "Làm việc mỗi ngày"
  }
];

const benefits = [
  {
    label: "Ít nhiễu hơn",
    text: "Trang chủ chỉ tập trung vào việc bắt đầu, đăng nhập và hiểu luồng dùng cốt lõi."
  },
  {
    label: "Dễ quyết định hơn",
    text: "Mỗi trang có một vai trò rõ: làm việc, lên kế hoạch, rà soát chi tiết."
  },
  {
    label: "Ổn định hơn",
    text: "Không phụ thuộc ảnh hay thành phần phức tạp bên ngoài, nên giao diện tải nhanh và nhất quán."
  }
];

function WorkspacePreview() {
  return (
    <div className="ui-panel overflow-hidden bg-white">
      <div className="border-b border-stone-200 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              Không gian làm việc
            </p>
            <h2 className="mt-1 text-sm font-semibold text-stone-950">
              Hôm nay cần xử lý gì?
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="ui-pill">3 việc mở</span>
            <span className="ui-pill">1 việc quá hạn</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 bg-stone-50 p-4 md:grid-cols-3">
        <section className="ui-board-column p-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
              Chưa bắt đầu
            </span>
            <span className="text-[10px] font-semibold text-stone-400">2</span>
          </div>
          <div className="mt-3 space-y-2">
            <article className="ui-card-compact p-3">
              <p className="text-[11px] font-semibold text-stone-950">
                Hoàn thiện bố cục dashboard
              </p>
              <p className="mt-1 text-[10px] text-stone-500">
                Mục tiêu học tập · Mốc 1
              </p>
            </article>
            <article className="ui-card-compact p-3">
              <p className="text-[11px] font-semibold text-stone-950">
                Soát lại danh sách công việc
              </p>
              <p className="mt-1 text-[10px] text-stone-500">
                Mục tiêu cá nhân · Mốc 2
              </p>
            </article>
          </div>
        </section>

        <section className="ui-board-column border-stone-300 bg-white p-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
              Đang làm
            </span>
            <span className="text-[10px] font-semibold text-stone-400">1</span>
          </div>
          <div className="mt-3 space-y-2">
            <article className="ui-card-compact border-sky-200 p-3">
              <div className="flex items-center gap-1">
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                  Tập trung
                </span>
              </div>
              <p className="mt-1.5 text-[11px] font-semibold text-stone-950">
                Tối ưu trải nghiệm người dùng
              </p>
              <p className="mt-1 text-[10px] text-stone-500">
                Mục tiêu chính · Mốc 3
              </p>
            </article>
          </div>
        </section>

        <section className="ui-board-column p-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Hoàn thành
            </span>
            <span className="text-[10px] font-semibold text-stone-400">1</span>
          </div>
          <div className="mt-3 space-y-2">
            <article className="ui-card-compact p-3">
              <p className="text-[11px] font-semibold text-stone-950">
                Tạo luồng đăng nhập mới
              </p>
              <p className="mt-1 text-[10px] text-stone-500">
                Mục tiêu hệ thống · Mốc 1
              </p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function PublicHomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#fafaf9_55%,#f5f5f4_100%)]">
      <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
        <header className="ui-toolbar-panel px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-950 text-sm font-black text-white">
                M
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-950">
                  Quản lý mục tiêu cá nhân
                </p>
                <p className="text-xs text-stone-500">
                  Gọn hơn, rõ hơn, dễ bắt đầu hơn
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
                href="/login"
              >
                Đăng nhập
              </Link>
              <Link
                className="ui-dark-cta rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold !text-white transition hover:bg-stone-800"
                href="/register"
              >
                Bắt đầu ngay
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-14">
          <div>
            <div className="inline-flex rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              Trang chủ mới
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
              Quản lý mục tiêu, cột mốc và công việc trong một luồng rõ ràng.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600">
              Không còn kiểu landing nói về chuyển đổi kỹ thuật. Trang chủ mới giúp
              người dùng hiểu ngay ứng dụng này để làm gì, bắt đầu ở đâu và thao tác
              chính sẽ diễn ra như thế nào.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="ui-dark-cta inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-stone-800"
                href="/register"
              >
                Tạo tài khoản
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-950 hover:bg-stone-50"
                href="/login"
              >
                Tôi đã có tài khoản
              </Link>
            </div>

            <div className="mt-7 grid gap-2 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3"
                  key={item}
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-sm leading-6 text-stone-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-4">
            <WorkspacePreview />
          </div>
        </section>

        <section className="grid gap-4 border-t border-stone-200 py-8 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article className="ui-panel px-5 py-5" key={benefit.label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                {benefit.label}
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                {benefit.text}
              </p>
            </article>
          ))}
        </section>

        <section className="py-6">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              Các bước tối ưu trải nghiệm người dùng
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-stone-950 md:text-3xl">
              Người mới vào là hiểu ngay nên làm gì trước.
            </h2>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article className="ui-panel px-5 py-5" key={step.title}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-stone-300">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-stone-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="py-8">
          <div className="overflow-hidden rounded-[0.875rem] border border-stone-950 bg-stone-950 text-white shadow-[0_1px_1px_rgba(28,25,23,0.03)]">
            <div className="grid gap-6 px-6 py-7 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Bắt đầu gọn gàng
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
                  Vào app là biết ngay nơi làm việc chính nằm ở đâu.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
                  Trang chủ public giúp hiểu sản phẩm, còn sau khi đăng nhập bạn sẽ
                  được đưa thẳng vào không gian làm việc duy nhất để kéo thả và xử lý
                  công việc mỗi ngày.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  className="ui-dark-cta rounded-full bg-white px-5 py-3 text-sm font-semibold !text-stone-950 transition hover:bg-stone-200"
                  href="/register"
                >
                  Tạo tài khoản
                </Link>
                <Link
                  className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-stone-500 hover:bg-stone-900"
                  href="/login"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
