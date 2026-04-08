import { deleteCategoryAction } from "@/features/categories/actions/delete-category";
import { Button } from "@/components/ui/button";

export function DeleteCategoryForm({ categoryId }: { categoryId: string }) {
  return (
    <form action={deleteCategoryAction}>
      <input name="categoryId" type="hidden" value={categoryId} />
      <Button type="submit" variant="destructive">
        Xoa
      </Button>
    </form>
  );
}
