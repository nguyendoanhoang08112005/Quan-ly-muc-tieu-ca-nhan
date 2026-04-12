import Link from "next/link";
import type { Route } from "next";
import { Compass, Plus, Sparkles, Target } from "lucide-react";
import {
  PageEmptyState,
  PageHero
} from "@/components/shared/app-page-patterns";
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
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        actions={
          <Link
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-2 rounded-full !text-white"
            )}
            href="/notes/new"
          >
            <Plus className="h-4 w-4" />
            Tạo ghi chú mới
          </Link>
        }
        aside={
          <div className="rounded-[1.45rem] border border-[#eadfd4] bg-[#fffaf6] px-4 py-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              Lọc hiện tại
            </p>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-3">
                <span>Loại</span>
                <span className="font-semibold text-stone-950">
                  {typeFilter === "all" ? "Tất cả" : noteableTypeLabels[typeFilter as keyof typeof noteableTypeLabels]}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Hiển thị</span>
                <span className="font-semibold text-stone-950">{filteredNotes.length}</span>
              </div>
            </div>
          </div>
        }
        description="Ghi chú có thể gắn vào mục tiêu, cột mốc, công việc, thói quen, dự án và nhiều ngữ cảnh khác."
        eyebrow="Ghi chú"
        metrics={[
          { icon: Compass, label: "Tổng ghi chú", value: notes.length, hint: "Toàn bộ dữ liệu" },
          { icon: Target, label: "Đang hiển thị", value: filteredNotes.length, tone: "warm", hint: "Theo bộ lọc hiện tại" },
          { icon: Sparkles, label: "Loại lọc", value: typeFilter === "all" ? "Tất cả" : noteableTypeLabels[typeFilter as keyof typeof noteableTypeLabels], hint: "Nhóm đối tượng" }
        ]}
        title="Ghi chú đa đối tượng"
        trailVariant="mixed"
      />

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
        <PageEmptyState
          description="Hãy thử đổi từ khóa hoặc chuyển về tất cả đối tượng."
          title="Không tìm thấy ghi chú phù hợp"
        />
      ) : (
        <PageEmptyState
          action={
            <Link
              className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full !text-white")}
              href="/notes/new"
            >
              <Plus className="h-4 w-4" />
              Tạo ghi chú mới
            </Link>
          }
          description="Tạo ghi chú đầu tiên để lưu ý tưởng, ghi chú hoặc ngữ cảnh cho từng đối tượng trong hệ thống."
          title="Chưa có ghi chú nào"
        />
      )}
    </div>
  );
}
