"use client";

import Link from "next/link";
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
      setError("Bạn cần nhập đầy đủ email và mật khẩu.");
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
      setError("Không thể đăng nhập lúc này. Vui lòng thử lại.");
      return;
    }

    if (result.error) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }

    window.location.assign(result.url ?? callbackUrl ?? authRoutes.afterSignIn);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <h2 className="mt-3 text-3xl font-black text-stone-950">Đăng nhập</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Đăng nhập bằng hệ thống xác thực hiện tại trên nền Prisma.
        </p>
      </div>

      {showRegisteredMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Tài khoản đã được tạo. Bạn có thể đăng nhập ngay bây giờ.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-stone-800" htmlFor="email">
          Email
        </label>
        <Input
          autoComplete="email"
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
          className="text-sm font-semibold text-stone-800"
          htmlFor="password"
        >
          Mật khẩu
        </label>
        <Input
          autoComplete="current-password"
          id="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Nhập mật khẩu"
          type="password"
          value={password}
        />
      </div>

      <Button className="w-full" disabled={isPending} size="lg" type="submit">
        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      <p className="text-sm text-stone-600">
        Chưa có tài khoản?{" "}
        <Link
          className="font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
          href={authRoutes.register}
        >
          Tạo tài khoản
        </Link>
      </p>
    </form>
  );
}
