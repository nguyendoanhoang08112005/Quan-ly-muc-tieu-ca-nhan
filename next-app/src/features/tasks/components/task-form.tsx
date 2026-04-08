"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  goalPriorityLabels,
  workStatusLabels
} from "@/features/goals/goal-helpers";
import type { ProjectOption } from "@/features/projects/types";
import { createTaskAction } from "@/features/tasks/actions/create-task";
import { getInitialTaskFormActionState } from "@/features/tasks/actions/shared";
import { updateTaskAction } from "@/features/tasks/actions/update-task";
import type { TaskFormValues } from "@/features/tasks/types";

type TaskFormProps = {
  cancelHref: Route;
  goalId: string;
  milestoneId?: string;
  taskId?: string;
  initialValues?: Partial<TaskFormValues>;
  mode: "create" | "edit";
  projectOptions: ProjectOption[];
};

export function TaskForm({
  cancelHref,
  goalId,
  milestoneId,
  taskId,
  initialValues,
  mode,
  projectOptions
}: TaskFormProps) {
  const initialState = useMemo(
    () => getInitialTaskFormActionState(initialValues),
    [initialValues]
  );
  const serverAction = mode === "edit" ? updateTaskAction : createTaskAction;
  const [state, formAction, isPending] = useActionState(
    serverAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <input name="goalId" type="hidden" value={goalId} />
      {milestoneId ? (
        <input name="milestoneId" type="hidden" value={milestoneId} />
      ) : null}
      {taskId ? <input name="taskId" type="hidden" value={taskId} /> : null}

      <div>
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          {mode === "edit" ? "Cập nhật công việc" : "Tạo công việc mới"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Thao tác công việc được xác thực trước, sau đó đồng bộ lại tiến độ
          cột mốc và mục tiêu tương ứng.
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
            Tên công việc
          </span>
          <Input
            defaultValue={state.values.title}
            name="title"
            placeholder="Ví dụ: Tạo schema Zod cho công việc"
          />
          {state.fieldErrors?.title?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.title[0]}
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
            placeholder="Công việc này cần hoàn thành điều gì?"
            rows={4}
          />
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
            {Object.entries(workStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Độ ưu tiên
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
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Hạn công việc
          </span>
          <Input
            defaultValue={state.values.dueAt}
            name="dueAt"
            type="datetime-local"
          />
          {state.fieldErrors?.dueAt?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.dueAt[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Số phút dự kiến
          </span>
          <Input
            defaultValue={state.values.estimatedMinutes}
            min="1"
            name="estimatedMinutes"
            type="number"
          />
          {state.fieldErrors?.estimatedMinutes?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.estimatedMinutes[0]}
            </p>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Dự án
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.projectId}
            name="projectId"
          >
            <option value="">Không gắn dự án</option>
            {projectOptions.map((project) => (
              <option key={project.id} value={project.id}>
                {project.goalTitle
                  ? `${project.name} | ${project.goalTitle}`
                  : project.name}
              </option>
            ))}
          </select>
          {state.fieldErrors?.projectId?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.projectId[0]}
            </p>
          ) : null}
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 md:col-span-2">
          <input
            className="h-4 w-4 rounded border-stone-300"
            defaultChecked={state.values.isFocus}
            name="isFocus"
            type="checkbox"
          />
          <span className="text-sm font-medium text-stone-700">
            Đánh dấu đây là công việc ưu tiên
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} size="lg" type="submit">
          {mode === "edit"
            ? isPending
              ? "Đang cập nhật..."
              : "Cập nhật công việc"
            : isPending
              ? "Đang tạo..."
              : "Tạo công việc"}
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
