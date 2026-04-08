import { deleteCategoryAction } from "@/features/categories/actions/delete-category";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";

export function DeleteCategoryForm({ categoryId }: { categoryId: string }) {
  return (
    <form action={deleteCategoryAction}>
      <input name="categoryId" type="hidden" value={categoryId} />
      <ConfirmSubmitButton
        confirmMessage="Bạn có chắc muốn xóa danh mục này không? Các mục tiêu đang dùng danh mục sẽ cần gán lại."
        idleLabel="Xóa danh mục"
        pendingLabel="Đang xóa danh mục..."
        variant="destructive"
      />
    </form>
  );
}
