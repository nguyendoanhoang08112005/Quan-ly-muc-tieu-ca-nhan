import Link from "next/link";
import { landingStartSteps } from "@/features/landing/content";
import { landingFocusRing, landingSurfaceShadow } from "@/features/landing/theme";
import { cn } from "@/lib/utils";

export function PublicHomeStart({
  isAuthenticated
}: {
  isAuthenticated: boolean;
}) {
  return (
    <section
      className={cn(
        "mt-16 grid gap-5 rounded-[36px] border border-[#e8dfd5] p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]",
        "bg-[radial-gradient(circle_at_top_left,rgba(255,240,231,0.78),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(243,248,238,0.78),transparent_28%),linear-gradient(180deg,#ffffff_0%,#fbfaf8_100%)]",
        landingSurfaceShadow
      )}
      id="bat-dau"
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
              landingFocusRing
            )}
            href={isAuthenticated ? "/dashboard" : "/register"}
          >
            {isAuthenticated ? "Vào ứng dụng" : "Tạo tài khoản"}
          </Link>
          <Link
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-[14px] border border-[#e8dfd5] bg-white px-6 text-sm font-semibold text-[#1f1c1a] transition hover:bg-[#faf9f8]",
              landingFocusRing
            )}
            href="/login"
          >
            Đăng nhập
          </Link>
        </div>
      </div>

      <div className="grid gap-3">
        {landingStartSteps.map((item) => (
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
  );
}
