import Link from "next/link";
import type { Route } from "next";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageFilterForm } from "@/components/shared/page-filter-form";
import { DeleteNoteForm } from "@/features/notes/components/delete-note-form";
import {
  buildNoteExcerpt,
  noteableTypeLabels
} from "@/features/notes/note-helpers";
import { noteableTypeValues } from "@/features/notes/types";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDateTime } from "@/lib/dates";
import { getSingleSearchParam, matchesSearchTerm } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { listNotesForUser } from "@/server/modules/notes/queries";

type NotesPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    type?: string | string[];
  }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const userId = await requireAuthenticatedUserId();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const notes = await listNotesForUser(userId);
  const query = getSingleSearchParam(resolvedSearchParams?.q).trim();
  const typeFilter = getSingleSearchParam(resolvedSearchParams?.type) || "all";
  const filteredNotes = notes.filter((note) => {
    const matchesType = typeFilter === "all" || note.noteableType === typeFilter;

    return (
      matchesType &&
      matchesSearchTerm(query, [
        note.content,
        note.targetLabel,
        note.targetDescription,
        noteableTypeLabels[note.noteableType]
      ])
    );
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
              Ghi chú đa đối tượng
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Ghi chú có thể được gắn vào mục tiêu, cột mốc, công việc, thói
              quen, dự án và mục nhật ký.
            </p>
          </div>

          <Link
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 rounded-full !text-white"
            )}
            href="/notes/new"
            style={{ color: "#ffffff" }}
          >
            <Plus className="h-4 w-4" />
            Tạo ghi chú mới
          </Link>
        </div>
      </section>

      <PageFilterForm
        filters={[
          {
            label: "Loại ghi chú",
            name: "type",
            options: [
              { label: "Tất cả đối tượng", value: "all" },
              ...noteableTypeValues.map((value) => ({
                label: noteableTypeLabels[value],
                value
              }))
            ],
            value: typeFilter
          }
        ]}
        resetHref="/notes"
        resultLabel={`Đang hiển thị ${filteredNotes.length}/${notes.length} ghi chú.`}
        searchPlaceholder="Tìm theo nội dung, tên đối tượng hoặc ngữ cảnh"
        searchValue={query}
      />

      {filteredNotes.length > 0 ? (
        <section className="grid gap-6">
          {filteredNotes.map((note) => (
            <article
              className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
              key={note.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                      {noteableTypeLabels[note.noteableType]}
                    </span>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                      {note.targetLabel}
                    </span>
                  </div>

                  <p className="mt-4 text-base leading-7 text-stone-700">
                    {buildNoteExcerpt(note.content, 260)}
                  </p>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Tạo lúc {formatDisplayDateTime(note.createdAt)}
                    {note.targetDescription ? ` | ${note.targetDescription}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    className={cn(buttonVariants({ variant: "secondary" }))}
                    href={`/notes/${note.id}/edit` as Route}
                  >
                    Sửa
                  </Link>
                  <DeleteNoteForm noteId={note.id} />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : notes.length > 0 ? (
        <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
          <h2 className="text-2xl font-black text-stone-950">
            Không tìm thấy ghi chú phù hợp
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-500">
            Hãy thử đổi từ khóa hoặc chuyển về tất cả đối tượng.
          </p>
        </section>
      ) : (
        <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
          <h2 className="text-2xl font-black text-stone-950">
            Chưa có ghi chú nào
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-500">
            Tạo ghi chú đầu tiên để lưu ý tưởng, ghi chú hoặc ngữ cảnh cho từng
            đối tượng trong hệ thống.
          </p>
        </section>
      )}
    </div>
  );
}
