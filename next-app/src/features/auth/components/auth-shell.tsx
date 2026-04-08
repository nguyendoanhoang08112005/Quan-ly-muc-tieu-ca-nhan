import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

const highlights = [
  "Điều hướng ưu tiên máy chủ",
  "Đăng nhập bằng tài khoản và mật khẩu",
  "Xác thực dữ liệu và phân quyền ở máy chủ"
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center px-6 py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border-4 border-black bg-white p-8 shadow-[10px_10px_0_0_#0c0a09] lg:p-12">
          <Link
            className="inline-flex rounded-full border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-black"
            href="/"
          >
            Về trang chủ
          </Link>

          <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-stone-500">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-black md:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-600">
            {description}
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm font-semibold text-stone-700"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-stone-300 bg-white/95 p-8 shadow-sm backdrop-blur">
          {children}
          <div className="mt-8 border-t border-stone-200 pt-6 text-sm text-stone-600">
            {footer}
          </div>
        </section>
      </div>
    </main>
  );
}
