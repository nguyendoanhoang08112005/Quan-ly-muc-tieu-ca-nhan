"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getInitialNoteFormActionState
} from "@/features/notes/actions/shared";
import { createNoteAction } from "@/features/notes/actions/create-note";
import { updateNoteAction } from "@/features/notes/actions/update-note";
import { noteableTypeLabels } from "@/features/notes/note-helpers";
import type {
  NoteFormValues,
  NoteTargetOption
} from "@/features/notes/types";

type NoteFormProps = {
  cancelHref: Route;
  noteId?: string;
  initialValues?: Partial<NoteFormValues>;
  mode: "create" | "edit";
  targetOptions: NoteTargetOption[];
};

const textareaClassName =
  "min-h-40 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10";

export function NoteForm({
  cancelHref,
  noteId,
  initialValues,
  mode,
  targetOptions
}: NoteFormProps) {
  const initialState = useMemo(
    () => getInitialNoteFormActionState(initialValues),
    [initialValues]
  );
  const serverAction = mode === "edit" ? updateNoteAction : createNoteAction;
  const [state, formAction, isPending] = useActionState(
    serverAction,
    initialState
  );
  const [selectedType, setSelectedType] = useState<
    NoteFormValues["noteableType"] | null
  >(null);
  const effectiveSelectedType = selectedType ?? state.values.noteableType;

  const filteredTargets = useMemo(() => {
    return targetOptions.filter((option) => option.type === effectiveSelectedType);
  }, [effectiveSelectedType, targetOptions]);

  const targetDefaultValue =
    effectiveSelectedType === state.values.noteableType
      ? state.values.noteableId
      : "";

  return (
    <form action={formAction} className="space-y-5">
      {noteId ? <input name="noteId" type="hidden" value={noteId} /> : null}

      <div>
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          {mode === "edit" ? "Cập nhật ghi chú" : "Tạo ghi chú mới"}
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
            Loại đối tượng
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.noteableType}
            name="noteableType"
            onChange={(event) =>
              setSelectedType(event.currentTarget.value as NoteFormValues["noteableType"])
            }
          >
            {Object.entries(noteableTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Đối tượng được gắn ghi chú
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={targetDefaultValue}
            key={effectiveSelectedType}
            name="noteableId"
          >
            <option value="">Chọn đối tượng</option>
            {filteredTargets.map((target) => (
                <option key={`${target.type}-${target.id}`} value={target.id}>
                  {target.description
                  ? `${target.label} | ${target.description}`
                  : target.label}
                </option>
            ))}
          </select>
          {state.fieldErrors?.noteableId?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.noteableId[0]}
            </p>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Nội dung ghi chú
          </span>
          <textarea
            className={textareaClassName}
            defaultValue={state.values.content}
            name="content"
          />
          {state.fieldErrors?.content?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.content[0]}
            </p>
          ) : null}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} type="submit">
          {mode === "edit"
            ? isPending
              ? "Đang cập nhật..."
              : "Cập nhật ghi chú"
            : isPending
              ? "Đang tạo..."
              : "Tạo ghi chú"}
        </Button>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
          href={cancelHref}
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
