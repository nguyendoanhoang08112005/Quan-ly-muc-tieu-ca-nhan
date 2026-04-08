"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTagAction } from "@/features/tags/actions/create-tag";
import { getInitialTagFormActionState } from "@/features/tags/actions/shared";
import { updateTagAction } from "@/features/tags/actions/update-tag";
import type { TagFormValues } from "@/features/tags/types";

type TagFormProps = {
  cancelHref: Route;
  initialValues?: Partial<TagFormValues>;
  mode: "create" | "edit";
  tagId?: string;
};

export function TagForm({
  cancelHref,
  initialValues,
  mode,
  tagId
}: TagFormProps) {
  const initialState = useMemo(
    () => getInitialTagFormActionState(initialValues),
    [initialValues]
  );
  const serverAction = mode === "edit" ? updateTagAction : createTagAction;
  const [state, formAction, isPending] = useActionState(
    serverAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      {tagId ? <input name="tagId" type="hidden" value={tagId} /> : null}

      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
          Phase 6
        </p>
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          {mode === "edit" ? "Cap nhat tag" : "Tao tag moi"}
        </h2>
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ten tag
          </span>
          <Input defaultValue={state.values.name} name="name" />
          {state.fieldErrors?.name?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.name[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Mau
          </span>
          <Input defaultValue={state.values.color} name="color" placeholder="#ea580c" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} type="submit">
          {mode === "edit"
            ? isPending
              ? "Dang cap nhat..."
              : "Cap nhat tag"
            : isPending
              ? "Dang tao..."
              : "Tao tag"}
        </Button>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
          href={cancelHref}
        >
          Huy
        </Link>
      </div>
    </form>
  );
}
