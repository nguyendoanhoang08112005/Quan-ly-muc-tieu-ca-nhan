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
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          {mode === "edit" ? "Cập nhật dự án" : "Tạo dự án mới"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Dự án được gắn với mục tiêu nếu cần, và tiến độ sẽ tự động đồng bộ
          theo trạng thái công việc thuộc dự án.
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
            Mục tiêu liên kết
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.goalId}
            name="goalId"
          >
            <option value="">Không liên kết mục tiêu</option>
            {goalOptions.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Trạng thái
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
            Tên dự án
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
            Mô tả
          </span>
          <Textarea
            defaultValue={state.values.description}
            name="description"
            rows={5}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Màu
          </span>
          <Input defaultValue={state.values.color} name="color" placeholder="#0f172a" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ngày bắt đầu
          </span>
          <Input defaultValue={state.values.startDate} name="startDate" type="date" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ngày kết thúc
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
              ? "Đang cập nhật..."
              : "Cập nhật dự án"
            : isPending
              ? "Đang tạo..."
              : "Tạo dự án"}
        </Button>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-stone-300 px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
          href={cancelHref}
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
