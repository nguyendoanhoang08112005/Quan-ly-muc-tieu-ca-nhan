import Link from "next/link";
import type { Route } from "next";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DeleteNoteForm } from "@/features/notes/components/delete-note-form";
import {
  buildNoteExcerpt,
  noteableTypeLabels
} from "@/features/notes/note-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { listNotesForUser } from "@/server/modules/notes/queries";

export default async function NotesPage() {
  const userId = await requireAuthenticatedUserId();
  const notes = await listNotesForUser(userId);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
              Phase 7
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
              Notes polymorphic
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Notes co the duoc gan vao goal, milestone, task, habit, project va
              journal entry.
            </p>
          </div>

          <Link
            className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full")}
            href="/notes/new"
          >
            <Plus className="h-4 w-4" />
            Tao note moi
          </Link>
        </div>
      </section>

      {notes.length > 0 ? (
        <section className="grid gap-6">
          {notes.map((note) => (
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
                    Tao luc {formatDisplayDateTime(note.createdAt)}
                    {note.targetDescription ? ` | ${note.targetDescription}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    className={cn(buttonVariants({ variant: "secondary" }))}
                    href={`/notes/${note.id}/edit` as Route}
                  >
                    Sua
                  </Link>
                  <DeleteNoteForm noteId={note.id} />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
          <h2 className="text-2xl font-black text-stone-950">
            Chua co note nao
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-500">
            Tao note dau tien de luu insight, ghi chu hoac context cho tung doi
            tuong trong he thong.
          </p>
        </section>
      )}
    </div>
  );
}
