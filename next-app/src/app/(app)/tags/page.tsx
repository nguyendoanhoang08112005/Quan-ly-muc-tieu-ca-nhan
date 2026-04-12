import Link from "next/link";
import type { Route } from "next";
import { Sparkles } from "lucide-react";
import { PageEmptyState, PageHero } from "@/components/shared/app-page-patterns";
import { buttonVariants } from "@/components/ui/button";
import { DeleteTagForm } from "@/features/tags/components/delete-tag-form";
import { TagForm } from "@/features/tags/components/tag-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { listTagsForUser } from "@/server/modules/tags/queries";

export default async function TagsPage() {
  const userId = await requireAuthenticatedUserId();
  const tags = await listTagsForUser(userId);

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        description="Thẻ giúp gắn nhãn nhanh cho mục tiêu và làm cho việc lọc theo ngữ cảnh dễ hơn."
        eyebrow="Thẻ"
        metrics={[
          { icon: Sparkles, label: "Tổng thẻ", value: tags.length, hint: "Đang có trong hệ thống" }
        ]}
        title="Gắn nhãn cho mục tiêu"
        trailVariant="stone"
      />

    <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <TagForm cancelHref={"/tags" as Route} mode="create" />
      </section>

      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
              Thẻ
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950">Các thẻ đang được dùng</h2>
          </div>
          <div className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700">
            {tags.length} thẻ
          </div>
        </div>

        {tags.length > 0 ? (
          <div className="mt-8 grid gap-4">
            {tags.map((tag) => (
              <article
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5"
                key={tag.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {tag.color ? (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600">
                          {tag.color}
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-4 text-2xl font-black text-stone-950">
                      {tag.name}
                    </h2>
                    <p className="mt-2 text-sm text-stone-500">
                      {tag.goalsCount} mục tiêu đang gắn thẻ này
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      className={cn(buttonVariants({ variant: "secondary" }))}
                      href={`/tags/${tag.id}/edit` as Route}
                    >
                      Sửa
                    </Link>
                    <DeleteTagForm tagId={tag.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <PageEmptyState description="Tạo thẻ đầu tiên để gắn nhãn cho mục tiêu." title="Chưa có thẻ nào" />
          </div>
        )}
      </section>
    </div></div>
  );
}
