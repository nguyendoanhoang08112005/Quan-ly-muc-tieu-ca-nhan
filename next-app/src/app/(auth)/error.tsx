"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AuthError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-[2rem] border border-rose-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-rose-600">
          Lỗi xác thực
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-950">
          Khu vực đăng nhập gặp sự cố
        </h1>
        <p className="mt-4 text-sm leading-7 text-stone-600">
          {error.message || "Không thể tải màn hình đăng nhập ở thời điểm này."}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={reset} type="button">
            Thử tải lại
          </Button>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
            href="/"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
