"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  habitFrequencyLabels,
  habitStatusLabels
} from "@/features/habits/habit-helpers";
import { createHabitAction } from "@/features/habits/actions/create-habit";
import { getInitialHabitFormActionState } from "@/features/habits/actions/shared";
import { updateHabitAction } from "@/features/habits/actions/update-habit";
import type {
  HabitFormValues,
  HabitGoalOption
} from "@/features/habits/types";

type HabitFormProps = {
  cancelHref: Route;
  goalOptions: HabitGoalOption[];
  habitId?: string;
  initialValues?: Partial<HabitFormValues>;
  mode: "create" | "edit";
};

const textareaClassName =
  "min-h-28 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10";

export function HabitForm({
  cancelHref,
  goalOptions,
  habitId,
  initialValues,
  mode
}: HabitFormProps) {
  const initialState = useMemo(
    () => getInitialHabitFormActionState(initialValues),
    [initialValues]
  );
  const serverAction = mode === "edit" ? updateHabitAction : createHabitAction;
  const [state, formAction, isPending] = useActionState(
    serverAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      {habitId ? <input name="habitId" type="hidden" value={habitId} /> : null}

      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
          Phase 7
        </p>
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          {mode === "edit" ? "Cap nhat habit" : "Tao habit moi"}
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
            Ten habit
          </span>
          <Input defaultValue={state.values.title} name="title" />
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
          <textarea
            className={textareaClassName}
            defaultValue={state.values.description}
            name="description"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Goal lien ket
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.goalId}
            name="goalId"
          >
            <option value="">Khong lien ket goal</option>
            {goalOptions.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Tan suat
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.frequency}
            name="frequency"
          >
            {Object.entries(habitFrequencyLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Muc tieu moi ky
          </span>
          <Input
            defaultValue={state.values.targetCount}
            min="1"
            name="targetCount"
            type="number"
          />
          {state.fieldErrors?.targetCount?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.targetCount[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Don vi
          </span>
          <Input defaultValue={state.values.unit} name="unit" placeholder="lan" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Gio nhac
          </span>
          <Input
            defaultValue={state.values.reminderTime}
            name="reminderTime"
            type="time"
          />
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
            {Object.entries(habitStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ngay bat dau
          </span>
          <Input
            defaultValue={state.values.startDate}
            name="startDate"
            type="date"
          />
          {state.fieldErrors?.startDate?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.startDate[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ngay ket thuc
          </span>
          <Input defaultValue={state.values.endDate} name="endDate" type="date" />
          {state.fieldErrors?.endDate?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.endDate[0]}
            </p>
          ) : null}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} type="submit">
          {mode === "edit"
            ? isPending
              ? "Dang cap nhat..."
              : "Cap nhat habit"
            : isPending
              ? "Dang tao..."
              : "Tao habit"}
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
