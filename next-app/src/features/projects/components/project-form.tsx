"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProjectAction } from "@/features/projects/actions/create-project";
import { getInitialProjectFormActionState } from "@/features/projects/actions/shared";
import { updateProjectAction } from "@/features/projects/actions/update-project";
import {
  projectStatusLabels
} from "@/features/projects/project-helpers";
import type {
  ProjectFormValues,
  ProjectGoalOption
} from "@/features/projects/types";

type ProjectFormProps = {
  cancelHref: Route;
  goalOptions: ProjectGoalOption[];
  initialValues?: Partial<ProjectFormValues>;
  mode: "create" | "edit";
  projectId?: string;
};

export function ProjectForm({
  cancelHref,
  goalOptions,
  initialValues,
  mode,
  projectId
}: ProjectFormProps) {
  const initialState = useMemo(
    () => getInitialProjectFormActionState(initialValues),
    [initialValues]
  );
  const serverAction =
    mode === "edit" ? updateProjectAction : createProjectAction;
  const [state, formAction, isPending] = useActionState(
    serverAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      {projectId ? <input name="projectId" type="hidden" value={projectId} /> : null}

      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
          Phase 9
        </p>
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          {mode === "edit" ? "Cap nhat project" : "Tao project moi"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Project duoc gan voi goal neu can, va progress se tu dong sync theo
          trang thai task thuoc project.
        </p>
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
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
            Trang thai
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.status}
            name="status"
          >
            {Object.entries(projectStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ten project
          </span>
          <Input defaultValue={state.values.name} name="name" />
          {state.fieldErrors?.name?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.name[0]}
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
            rows={5}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Mau
          </span>
          <Input defaultValue={state.values.color} name="color" placeholder="#0f172a" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ngay bat dau
          </span>
          <Input defaultValue={state.values.startDate} name="startDate" type="date" />
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
        <Button disabled={isPending} size="lg" type="submit">
          {mode === "edit"
            ? isPending
              ? "Dang cap nhat..."
              : "Cap nhat project"
            : isPending
              ? "Dang tao..."
              : "Tao project"}
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
