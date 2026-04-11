"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerWithCredentials } from "@/features/auth/actions/register";
import { initialRegisterActionState } from "@/features/auth/actions/register-shared";

const inputClassName =
  "h-12 rounded-2xl border-[#e2d8cc] bg-white/92 px-4 text-[15px] shadow-[0_10px_20px_-18px_rgba(120,113,108,0.22)] placeholder:text-stone-400 focus:border-stone-500 focus:ring-stone-400/10";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerWithCredentials,
    initialRegisterActionState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-[#ead8e5] bg-[#fff1f8] px-3 py-1 text-[11px] font-semibold text-[#ab6788]">
          Thỏ giữ chỗ bắt đầu
        </span>
        <span className="rounded-full border border-[#e7dbcf] bg-white/88 px-3 py-1 text-[11px] font-semibold text-stone-500">
          Tạo nhịp mới mà không bị ngợp
        </span>
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-[1.35rem] border border-rose-200 bg-[linear-gradient(180deg,#fff5f6_0%,#ffecee_100%)] px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </div>
      ) : null}

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

      <div className="grid gap-5 md:grid-cols-2">
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

      <div className="rounded-[1.35rem] border border-[#ead8e5] bg-white/78 px-4 py-3 text-sm leading-6 text-stone-600">
        Tạo tài khoản xong là bạn có thể bắt đầu mục tiêu đầu tiên, kéo việc đầu tiên và dựng streak đầu tiên ngay.
      </div>

      <Button
        className="h-12 w-full rounded-2xl border border-[#e2d8cc] bg-white/90 text-[15px] font-semibold !text-stone-950 shadow-[0_14px_26px_-22px_rgba(120,113,108,0.3)] hover:bg-white"
        disabled={isPending}
        size="lg"
        type="submit"
        variant="secondary"
      >
        {isPending ? "Đang dựng chỗ cho bạn..." : "Tạo tài khoản"}
      </Button>
    </form>
  );
}
