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
  "h-[3.25rem] rounded-[1.15rem] border-[#e7dfd5] bg-white px-4 text-[15px] shadow-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-stone-400/10";

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
      setError("Vui lòng nhập đủ email và mật khẩu.");
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
      setError("Chưa thể đăng nhập lúc này. Thử lại sau.");
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
      {showRegisteredMessage ? (
        <div className="rounded-[1.2rem] border border-emerald-200 bg-[linear-gradient(180deg,#f2fbf5_0%,#e9f8ee_100%)] px-4 py-3 text-sm font-medium text-emerald-800">
          Tài khoản đã được tạo. Bạn có thể đăng nhập ngay bây giờ.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[1.2rem] border border-rose-200 bg-[linear-gradient(180deg,#fff5f6_0%,#ffecee_100%)] px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-[1.5rem] border border-[#ece7e1] bg-[#fcfbfa] p-4 sm:p-5">
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

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label
              className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
              Bảo mật
            </span>
          </div>
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
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.2rem] border border-[#ece7e1] bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Quay lại
          </p>
          <p className="mt-1 text-sm font-semibold text-stone-900">Dashboard</p>
        </div>
        <div className="rounded-[1.2rem] border border-[#ece7e1] bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Tiếp tục
          </p>
          <p className="mt-1 text-sm font-semibold text-stone-900">Board gần nhất</p>
        </div>
        <div className="rounded-[1.2rem] border border-[#ece7e1] bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Giữ nhịp
          </p>
          <p className="mt-1 text-sm font-semibold text-stone-900">Mục tiêu đang mở</p>
        </div>
      </div>

      <Button
        className="h-12 w-full rounded-[1.15rem] bg-[#202020] text-[15px] font-semibold !text-white hover:bg-[#111111]"
        disabled={isPending}
        size="lg"
        type="submit"
        variant="default"
      >
        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
