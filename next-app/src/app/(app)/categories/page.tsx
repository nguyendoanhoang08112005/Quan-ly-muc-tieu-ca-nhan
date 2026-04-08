import Link from "next/link";
import type { Route } from "next";
import { buttonVariants } from "@/components/ui/button";
import { CategoryForm } from "@/features/categories/components/category-form";
import { DeleteCategoryForm } from "@/features/categories/components/delete-category-form";
import { categoryTypeLabels } from "@/features/categories/category-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { listCategoriesForUser } from "@/server/modules/categories/queries";

export default async function CategoriesPage() {
  const userId = await requireAuthenticatedUserId();
  const categories = await listCategoriesForUser(userId);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[420px,1fr]">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <CategoryForm cancelHref={"/categories" as Route} mode="create" />
      </section>

      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
              Danh mục
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950">
              Dữ liệu phân loại cho mục tiêu
            </h1>
          </div>
          <div className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700">
            {categories.length} danh mục
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="mt-8 grid gap-4">
            {categories.map((category) => (
              <article
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5"
                key={category.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600">
                        {categoryTypeLabels[category.type]}
                      </span>
                      {category.color ? (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600">
                          {category.color}
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-4 text-2xl font-black text-stone-950">
                      {category.name}
                    </h2>
                    <p className="mt-2 text-sm text-stone-500">
                      {category.goalsCount} mục tiêu đang sử dụng
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      className={cn(buttonVariants({ variant: "secondary" }))}
                      href={`/categories/${category.id}/edit` as Route}
                    >
                      Sửa
                    </Link>
                    <DeleteCategoryForm categoryId={category.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center text-sm text-stone-500">
            Chưa có danh mục nào.
          </div>
        )}
      </section>
    </div>
  );
}
