import Link from "next/link";
import { PawPrint } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { cn } from "@/lib/utils";
import { landingFocusRing } from "@/features/landing/theme";

function NavActions({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          className={cn(
            "inline-flex h-8 items-center justify-center rounded-[8px] bg-[#f0f0f0] px-3 text-sm font-semibold text-[#1f1f1f] transition hover:bg-[#e7e7e7]",
            landingFocusRing
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
          landingFocusRing
        )}
        href="/login"
      >
        Đăng nhập
      </Link>
      <Link
        className={cn(
          "inline-flex h-8 items-center justify-center rounded-[8px] bg-[#202020] px-3 text-sm font-semibold text-white transition hover:bg-[#111111]",
          landingFocusRing
        )}
        href="/register"
      >
        Tạo tài khoản
      </Link>
    </div>
  );
}

export function PublicHomeHeader({
  isAuthenticated
}: {
  isAuthenticated: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#eadfd4] bg-[#fcfaf8]/90 backdrop-blur-[10px]">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-5">
        <Link className={cn("flex items-center gap-3", landingFocusRing)} href="/">
          <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[linear-gradient(135deg,#c9795a,#8faa71)] text-white">
            <PawPrint aria-hidden="true" className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-[-0.02em] text-[#1f1c1a]">
              Mục tiêu cá nhân
            </p>
            <p className="text-[11px] text-[#7c736c]">mục tiêu, cột mốc và việc mỗi ngày</p>
          </div>
        </Link>

        <nav
          aria-label="Điều hướng landing page"
          className="hidden items-center gap-6 text-sm font-medium text-[#6b645d] lg:flex"
        >
          <Link className={cn("transition hover:text-[#1f1c1a]", landingFocusRing)} href="#tong-quan">
            Tổng quan
          </Link>
          <Link className={cn("transition hover:text-[#1f1c1a]", landingFocusRing)} href="#tinh-nang">
            Tính năng
          </Link>
          <Link className={cn("transition hover:text-[#1f1c1a]", landingFocusRing)} href="#bat-dau">
            Bắt đầu
          </Link>
        </nav>

        <NavActions isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}
