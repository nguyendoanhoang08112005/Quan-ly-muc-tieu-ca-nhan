import type { Route } from "next";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/features/categories/components/category-form";
import { categoryIdSchema } from "@/features/categories/schemas/category-schemas";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { getCategoryFormValuesForUser } from "@/server/modules/categories/queries";

type EditCategoryPageProps = {
  params: Promise<{
    categoryId: string;
  }>;
};

export default async function EditCategoryPage({
  params
}: EditCategoryPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { categoryId } = await params;
  const parsedCategoryId = categoryIdSchema.safeParse(categoryId);

  if (!parsedCategoryId.success) {
    notFound();
  }

  const category = await getCategoryFormValuesForUser(
    userId,
    BigInt(parsedCategoryId.data)
  );

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <CategoryForm
          cancelHref={"/categories" as Route}
          categoryId={parsedCategoryId.data}
          initialValues={category}
          mode="edit"
        />
      </div>
    </div>
  );
}
