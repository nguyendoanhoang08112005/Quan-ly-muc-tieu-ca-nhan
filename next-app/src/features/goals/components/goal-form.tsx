"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createGoalAction } from "@/features/goals/actions/create-goal";
import { getInitialGoalFormActionState } from "@/features/goals/actions/shared";
import { updateGoalAction } from "@/features/goals/actions/update-goal";
import {
  goalPriorityLabels,
  goalStatusLabels,
  goalTypeLabels
} from "@/features/goals/goal-helpers";
import type { GoalFormValues } from "@/features/goals/types";
import { addDaysToDateInput, diffDateInputs } from "@/lib/dates";

type GoalFormProps = {
  cancelHref: Route;
  goalId?: string;
  initialValues?: Partial<GoalFormValues>;
  mode: "create" | "edit";
};

export function GoalForm({
  cancelHref,
  goalId,
  initialValues,
  mode
}: GoalFormProps) {
  const initialState = useMemo(
    () => getInitialGoalFormActionState(initialValues),
    [initialValues]
  );
  const serverAction = mode === "edit" ? updateGoalAction : createGoalAction;
  const [state, formAction, isPending] = useActionState(
    serverAction,
    initialState
  );
  const [startDate, setStartDate] = useState(state.values.startDate);
  const [targetDate, setTargetDate] = useState(state.values.targetDate);
  const timelineDays = diffDateInputs(startDate, targetDate);
  const submitLabel =
    mode === "edit"
      ? isPending
        ? "Dang cap nhat..."
        : "Cap nhat goal"
      : isPending
        ? "Dang tao goal..."
        : "Tao goal";

  return (
    <form action={formAction} className="space-y-6">
      {goalId ? <input name="goalId" type="hidden" value={goalId} /> : null}

      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
          Phase 4
        </p>
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          {mode === "edit" ? "Cap nhat muc tieu" : "Tao muc tieu moi"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Form nay chay bang Server Actions + Zod. Page van la Server Component,
          chi phan form moi bat `use client`.
        </p>
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ten muc tieu
          </span>
          <Input
            defaultValue={state.values.title}
            name="title"
            placeholder="Vi du: Hoan thanh flow goal CRUD bang Next.js"
          />
          {state.fieldErrors?.title?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.title[0]}
            </p>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Mo ta
          </span>
          <Textarea
            defaultValue={state.values.description}
            name="description"
            placeholder="Mo ta ket qua, pham vi va y nghia cua muc tieu nay."
            rows={5}
          />
          {state.fieldErrors?.description?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.description[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Loai muc tieu
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.goalType}
            name="goalType"
          >
            {Object.entries(goalTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.goalType?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.goalType[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Do uu tien
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.priority}
            name="priority"
          >
            {Object.entries(goalPriorityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.priority?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.priority[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Trang thai
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.status}
            name="status"
          >
            {Object.entries(goalStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.status?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.status[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ngay bat dau
          </span>
          <Input
            onChange={(event) => {
              const nextStartDate = event.target.value;
              setStartDate(nextStartDate);

              if (targetDate && nextStartDate > targetDate) {
                setTargetDate(nextStartDate);
              }
            }}
            value={startDate}
            name="startDate"
            type="date"
          />
          {state.fieldErrors?.startDate?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.startDate[0]}
            </p>
          ) : null}
        </label>

        <div className="block">
          <label>
            <span className="mb-2 block text-sm font-semibold text-stone-700">
              Ngay muc tieu
            </span>
            <Input
              onChange={(event) => setTargetDate(event.target.value)}
              value={targetDate}
              name="targetDate"
              type="date"
            />
          </label>

          <div className="mt-3 flex flex-wrap gap-2">
            {[7, 30, 90].map((days) => (
              <button
                className="rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                key={days}
                onClick={() => setTargetDate(addDaysToDateInput(startDate, days))}
                type="button"
              >
                +{days} ngay
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-stone-500">
            {timelineDays === null
              ? "Chon ngay bat dau va ngay muc tieu de tinh timeline."
              : `Timeline tam tinh: ${timelineDays} ngay.`}
          </p>

          {state.fieldErrors?.targetDate?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.targetDate[0]}
            </p>
          ) : null}
        </div>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ghi chu
          </span>
          <Textarea
            defaultValue={state.values.note}
            name="note"
            placeholder="Thong tin bo sung, rang buoc, tai nguyen can chuan bi..."
            rows={4}
          />
          {state.fieldErrors?.note?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.note[0]}
            </p>
          ) : null}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} size="lg" type="submit">
          {submitLabel}
        </Button>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-stone-300 px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
          href={cancelHref}
        >
          Huy
        </Link>
      </div>
    </form>
  );
}
