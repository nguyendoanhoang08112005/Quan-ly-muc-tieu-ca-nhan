"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerWithCredentials } from "@/features/auth/actions/register";
import { initialRegisterActionState } from "@/features/auth/actions/register-shared";

const inputClassName =
  "h-[3.25rem] rounded-[1.15rem] border-[#e7dfd5] bg-white px-4 text-[15px] shadow-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-stone-400/10";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerWithCredentials,
    initialRegisterActionState
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && state.message ? (
        <div className="rounded-[1.2rem] border border-rose-200 bg-[linear-gradient(180deg,#fff5f6_0%,#ffecee_100%)] px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </div>
      ) : null}

      <div className="rounded-[1.5rem] border border-[#ece7e1] bg-[#fcfbfa] p-4 sm:p-5">
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"
            htmlFor="name"
          >
            Họ tên
          </label>
          <Input
            autoComplete="name"
            className={inputClassName}
            defaultValue={state.values?.name ?? ""}
            id="name"
            name="name"
            placeholder="Nguyen Van A"
          />
          {state.fieldErrors?.name?.[0] ? (
            <p className="text-sm text-rose-600">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div className="mt-4 space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"
            htmlFor="email"
          >
            Email
          </label>
          <Input
            autoComplete="email"
            className={inputClassName}
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

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <Input
              autoComplete="new-password"
              className={inputClassName}
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
              className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"
              htmlFor="passwordConfirmation"
            >
              Xác nhận mật khẩu
            </label>
            <Input
              autoComplete="new-password"
              className={inputClassName}
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
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.2rem] border border-[#ece7e1] bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Khởi tạo
          </p>
          <p className="mt-1 text-sm font-semibold text-stone-900">Mục tiêu đầu tiên</p>
        </div>
        <div className="rounded-[1.2rem] border border-[#ece7e1] bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Kéo việc
          </p>
          <p className="mt-1 text-sm font-semibold text-stone-900">Board đầu ngày</p>
        </div>
        <div className="rounded-[1.2rem] border border-[#ece7e1] bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Giữ đều
          </p>
          <p className="mt-1 text-sm font-semibold text-stone-900">Nhịp đầu tiên</p>
        </div>
      </div>

      <Button
        className="h-12 w-full rounded-[1.15rem] bg-[#202020] text-[15px] font-semibold !text-white hover:bg-[#111111]"
        disabled={isPending}
        size="lg"
        type="submit"
        variant="default"
      >
        {isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </Button>
    </form>
  );
}
