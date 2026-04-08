"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useRef
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileAction } from "@/features/profile/actions/update-profile";
import { getInitialProfileFormActionState } from "@/features/profile/actions/shared";
import {
  commonTimezoneOptions,
  profileLocaleLabels,
  type ProfileFormValues
} from "@/features/profile/types";

export function ProfileForm({
  initialValues
}: {
  initialValues: ProfileFormValues;
}) {
  const router = useRouter();
  const { update } = useSession();
  const lastSyncedKeyRef = useRef<string | null>(null);
  const initialState = useMemo(
    () => getInitialProfileFormActionState(initialValues),
    [initialValues]
  );
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  useEffect(() => {
    if (
      state.status !== "success" ||
      !state.sessionUpdate ||
      !state.syncKey ||
      lastSyncedKeyRef.current === state.syncKey
    ) {
      return;
    }

    lastSyncedKeyRef.current = state.syncKey;

    void update({
      email: state.sessionUpdate.email,
      image: state.sessionUpdate.image,
      locale: state.sessionUpdate.locale,
      name: state.sessionUpdate.name,
      timezone: state.sessionUpdate.timezone
    }).finally(() => {
      startTransition(() => {
        router.refresh();
      });
    });
  }, [router, state, update]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
          Phase 14
        </p>
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          Cap nhat profile
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Form nay chay bang Server Action + Zod, sau khi luu xong se dong bo
          lại NextAuth session để sidebar và các route private cập nhật ngay.
        </p>
      </div>

      {state.status === "success" && state.message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {state.message}
        </div>
      ) : null}

      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ten hien thi
          </span>
          <Input defaultValue={state.values.name} name="name" />
          {state.fieldErrors?.name?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">{state.fieldErrors.name[0]}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Email
          </span>
          <Input
            autoComplete="email"
            defaultValue={state.values.email}
            name="email"
            type="email"
          />
          {state.fieldErrors?.email?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">{state.fieldErrors.email[0]}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Locale
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.locale}
            name="locale"
          >
            {Object.entries(profileLocaleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.locale?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">{state.fieldErrors.locale[0]}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Timezone
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.timezone}
            name="timezone"
          >
            {commonTimezoneOptions.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
          {state.fieldErrors?.timezone?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.timezone[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Avatar path
          </span>
          <Input
            defaultValue={state.values.avatarPath}
            name="avatarPath"
            placeholder="https://example.com/avatar.png"
          />
          {state.fieldErrors?.avatarPath?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.avatarPath[0]}
            </p>
          ) : null}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} size="lg" type="submit">
          {isPending ? "Đang lưu..." : "Lưu profile"}
        </Button>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-stone-300 px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
          href={"/dashboard" as Route}
        >
          Quay lai dashboard
        </Link>
      </div>
    </form>
  );
}
