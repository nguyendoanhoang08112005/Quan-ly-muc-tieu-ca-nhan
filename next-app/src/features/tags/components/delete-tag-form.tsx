import { deleteTagAction } from "@/features/tags/actions/delete-tag";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";

export function DeleteTagForm({ tagId }: { tagId: string }) {
  return (
    <form action={deleteTagAction}>
      <input name="tagId" type="hidden" value={tagId} />
      <ConfirmSubmitButton
        confirmMessage="Bạn có chắc muốn xóa thẻ này không? Các mục tiêu đang gắn thẻ sẽ cần cập nhật lại."
        idleLabel="Xóa thẻ"
        pendingLabel="Đang xóa thẻ..."
        variant="destructive"
      />
    </form>
  );
}
