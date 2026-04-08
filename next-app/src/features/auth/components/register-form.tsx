"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerWithCredentials } from "@/features/auth/actions/register";
import { initialRegisterActionState } from "@/features/auth/actions/register-shared";
import { authRoutes } from "@/lib/auth/routes";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerWithCredentials,
    initialRegisterActionState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
          Phase 3
        </p>
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          Tạo tài khoản
        </h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Đăng ký bằng server action có validate Zod trước khi ghi vào database.
        </p>
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-stone-800" htmlFor="name">
          Họ tên
        </label>
        <Input
          autoComplete="name"
          defaultValue={state.values?.name ?? ""}
          id="name"
          name="name"
          placeholder="Nguyen Van A"
        />
        {state.fieldErrors?.name?.[0] ? (
          <p className="text-sm text-rose-600">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-stone-800" htmlFor="email">
          Email
        </label>
        <Input
          autoComplete="email"
          defaultValue={state.values?.email ?? ""}
          id="email"
          name="email"
          placeholder="you@example.com"
          type="email"
        />
        {state.fieldErrors?.email?.[0] ? (
          <p className="text-sm text-rose-600">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-semibold text-stone-800"
          htmlFor="password"
        >
          Mật khẩu
        </label>
        <Input
          autoComplete="new-password"
          id="password"
          name="password"
          placeholder="Tối thiểu 8 ký tự"
          type="password"
        />
        {state.fieldErrors?.password?.[0] ? (
          <p className="text-sm text-rose-600">{state.fieldErrors.password[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-semibold text-stone-800"
          htmlFor="passwordConfirmation"
        >
          Xác nhận mật khẩu
        </label>
        <Input
          autoComplete="new-password"
          id="passwordConfirmation"
          name="passwordConfirmation"
          placeholder="Nhập lại mật khẩu"
          type="password"
        />
        {state.fieldErrors?.passwordConfirmation?.[0] ? (
          <p className="text-sm text-rose-600">
            {state.fieldErrors.passwordConfirmation[0]}
          </p>
        ) : null}
      </div>

      <Button className="w-full" disabled={isPending} size="lg" type="submit">
        {isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </Button>

      <p className="text-sm text-stone-600">
        Đã có tài khoản?{" "}
        <Link
          className="font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
          href={authRoutes.signIn}
        >
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
