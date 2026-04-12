import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { PublicHomePreview } from "@/features/landing/components/public-home-preview";
import { landingFocusRing, landingSurfaceShadow } from "@/features/landing/theme";
import { cn } from "@/lib/utils";

export function PublicHomeHero({
  isAuthenticated
}: {
  isAuthenticated: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[40px] border border-[#e8dfd5] px-4 pb-4 pt-6 sm:px-6 sm:pb-6 sm:pt-7 lg:px-8 lg:pb-8 lg:pt-8",
        "bg-[radial-gradient(circle_at_top_left,rgba(255,240,231,0.95),transparent_32%),radial-gradient(circle_at_top_right,rgba(243,248,238,0.95),transparent_30%),linear-gradient(180deg,#fcfbf8_0%,#ffffff_42%,#fbfaf8_100%)]",
        landingSurfaceShadow
      )}
    >
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
                  landingFocusRing
                )}
                href="/dashboard"
              >
                Vào ứng dụng
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
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
                  landingFocusRing
                )}
                href="/register"
              >
                Tạo tài khoản
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-[14px] px-4 text-sm font-semibold text-[#6b645d] underline-offset-4 transition hover:text-[#1f1c1a] hover:underline",
                  landingFocusRing
                )}
                href="#bat-dau"
              >
                Xem cách hoạt động
              </Link>
            </>
          )}
        </div>
      </div>

      <PublicHomePreview />
    </div>
  );
}
