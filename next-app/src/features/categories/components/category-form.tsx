"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  categoryTypeLabels
} from "@/features/categories/category-helpers";
import { createCategoryAction } from "@/features/categories/actions/create-category";
import { getInitialCategoryFormActionState } from "@/features/categories/actions/shared";
import { updateCategoryAction } from "@/features/categories/actions/update-category";
import type { CategoryFormValues } from "@/features/categories/types";

type CategoryFormProps = {
  cancelHref: Route;
  categoryId?: string;
  initialValues?: Partial<CategoryFormValues>;
  mode: "create" | "edit";
};

export function CategoryForm({
  cancelHref,
  categoryId,
  initialValues,
  mode
}: CategoryFormProps) {
  const initialState = useMemo(
    () => getInitialCategoryFormActionState(initialValues),
    [initialValues]
  );
  const serverAction =
    mode === "edit" ? updateCategoryAction : createCategoryAction;
  const [state, formAction, isPending] = useActionState(
    serverAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      {categoryId ? (
        <input name="categoryId" type="hidden" value={categoryId} />
      ) : null}

      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
          Phase 6
        </p>
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          {mode === "edit" ? "Cap nhat category" : "Tao category moi"}
        </h2>
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ten category
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
          <Input defaultValue={state.values.color} name="color" placeholder="#0f172a" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Icon
          </span>
          <Input defaultValue={state.values.icon} name="icon" placeholder="target" />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Loai category
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.type}
            name="type"
          >
            {Object.entries(categoryTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} type="submit">
          {mode === "edit"
            ? isPending
              ? "Dang cap nhat..."
              : "Cap nhat category"
            : isPending
              ? "Dang tao..."
              : "Tao category"}
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
