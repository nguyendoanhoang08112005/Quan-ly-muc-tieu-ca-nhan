"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authRoutes } from "@/lib/auth/routes";

type LoginFormProps = {
  callbackUrl?: string;
  defaultEmail?: string;
  showRegisteredMessage?: boolean;
};

const inputClassName =
  "h-12 rounded-2xl border-[#e2d8cc] bg-white/92 px-4 text-[15px] shadow-[0_10px_20px_-18px_rgba(120,113,108,0.22)] placeholder:text-stone-400 focus:border-stone-500 focus:ring-stone-400/10";

export function LoginForm({
  callbackUrl,
  defaultEmail = "",
  showRegisteredMessage = false
}: LoginFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Mèo chưa thấy đủ email và mật khẩu.");
      return;
    }

    setIsPending(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: callbackUrl ?? authRoutes.afterSignIn,
      redirect: false
    });

    setIsPending(false);

    if (!result) {
      setError("Chưa thể đăng nhập lúc này. Thử lại sau một nhịp.");
      return;
    }

    if (result.error) {
      setError("Email hoặc mật khẩu chưa đúng.");
      return;
    }

    window.location.assign(result.url ?? callbackUrl ?? authRoutes.afterSignIn);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-[#f1d4ca] bg-[#fff1ea] px-3 py-1 text-[11px] font-semibold text-[#b05d42]">
          Mèo mở lại board
        </span>
        <span className="rounded-full border border-[#e7dbcf] bg-white/88 px-3 py-1 text-[11px] font-semibold text-stone-500">
          Đi tiếp từ chỗ đang dở
        </span>
      </div>

      {showRegisteredMessage ? (
        <div className="rounded-[1.35rem] border border-emerald-200 bg-[linear-gradient(180deg,#f2fbf5_0%,#e9f8ee_100%)] px-4 py-3 text-sm font-medium text-emerald-800">
          Tài khoản đã được tạo. Bạn có thể đăng nhập ngay bây giờ.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[1.35rem] border border-rose-200 bg-[linear-gradient(180deg,#fff5f6_0%,#ffecee_100%)] px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <label
          className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"
          htmlFor="email"
        >
          Email
        </label>
        <Input
          autoComplete="email"
          className={inputClassName}
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"
          htmlFor="password"
        >
          Mật khẩu
        </label>
        <Input
          autoComplete="current-password"
          className={inputClassName}
          id="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Nhập mật khẩu của bạn"
          type="password"
          value={password}
        />
      </div>

      <div className="rounded-[1.35rem] border border-[#f1dfd8] bg-white/78 px-4 py-3 text-sm leading-6 text-stone-600">
        Đăng nhập xong là vào lại ngay dashboard, board và các mục tiêu bạn đang theo.
      </div>

      <Button
        className="h-12 w-full rounded-2xl border border-[#e2d8cc] bg-white/90 text-[15px] font-semibold !text-stone-950 shadow-[0_14px_26px_-22px_rgba(120,113,108,0.3)] hover:bg-white"
        disabled={isPending}
        size="lg"
        type="submit"
        variant="secondary"
      >
        {isPending ? "Đang mở lại khu làm việc..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
