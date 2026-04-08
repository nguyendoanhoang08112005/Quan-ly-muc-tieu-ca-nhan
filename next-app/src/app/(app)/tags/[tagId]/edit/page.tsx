import type { Route } from "next";
import { notFound } from "next/navigation";
import { TagForm } from "@/features/tags/components/tag-form";
import { tagIdSchema } from "@/features/tags/schemas/tag-schemas";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { getTagFormValuesForUser } from "@/server/modules/tags/queries";

type EditTagPageProps = {
  params: Promise<{
    tagId: string;
  }>;
};

export default async function EditTagPage({ params }: EditTagPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { tagId } = await params;
  const parsedTagId = tagIdSchema.safeParse(tagId);

  if (!parsedTagId.success) {
    notFound();
  }

  const tag = await getTagFormValuesForUser(userId, BigInt(parsedTagId.data));

  if (!tag) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <TagForm
          cancelHref={"/tags" as Route}
          initialValues={tag}
          mode="edit"
          tagId={parsedTagId.data}
        />
      </div>
    </div>
  );
}
