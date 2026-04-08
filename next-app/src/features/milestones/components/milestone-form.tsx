"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { workStatusLabels } from "@/features/goals/goal-helpers";
import { createMilestoneAction } from "@/features/milestones/actions/create-milestone";
import {
  getInitialMilestoneFormActionState
} from "@/features/milestones/actions/shared";
import { updateMilestoneAction } from "@/features/milestones/actions/update-milestone";
import type { MilestoneFormValues } from "@/features/milestones/types";

type MilestoneFormProps = {
  cancelHref: Route;
  goalId: string;
  initialValues?: Partial<MilestoneFormValues>;
  milestoneId?: string;
  mode: "create" | "edit";
};

export function MilestoneForm({
  cancelHref,
  goalId,
  initialValues,
  milestoneId,
  mode
}: MilestoneFormProps) {
  const initialState = useMemo(
    () => getInitialMilestoneFormActionState(initialValues),
    [initialValues]
  );
  const serverAction =
    mode === "edit" ? updateMilestoneAction : createMilestoneAction;
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

      <div>
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          {mode === "edit" ? "Cập nhật cột mốc" : "Tạo cột mốc mới"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Cột mốc được xác thực bằng Zod trước khi ghi vào cơ sở dữ liệu và sẽ
          tự động cập nhật tiến độ mục tiêu.
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
            Tên cột mốc
          </span>
          <Input
            defaultValue={state.values.title}
            name="title"
            placeholder="Ví dụ: Chốt CRUD cho cột mốc"
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
            placeholder="Kết quả cụ thể cần đạt được trong cột mốc này."
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
            Thứ tự cột mốc
          </span>
          <Input
            defaultValue={state.values.sequenceNo}
            min="1"
            name="sequenceNo"
            placeholder="Để trống để tự tăng"
            type="number"
          />
          {state.fieldErrors?.sequenceNo?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.sequenceNo[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ngày bắt đầu
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
            Ngày mục tiêu
          </span>
          <Input
            defaultValue={state.values.targetDate}
            name="targetDate"
            type="date"
          />
          {state.fieldErrors?.targetDate?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.targetDate[0]}
            </p>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ghi chú
          </span>
          <Textarea
            defaultValue={state.values.note}
            name="note"
            placeholder="Ghi chú về phạm vi, ràng buộc, rủi ro..."
            rows={3}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} size="lg" type="submit">
          {mode === "edit"
            ? isPending
              ? "Đang cập nhật..."
              : "Cập nhật cột mốc"
            : isPending
              ? "Đang tạo..."
              : "Tạo cột mốc"}
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
