import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { deleteProjectAction } from "@/features/projects/actions/delete-project";

export function DeleteProjectForm({ projectId }: { projectId: string }) {
  return (
    <form action={deleteProjectAction}>
      <input name="projectId" type="hidden" value={projectId} />
      <ConfirmSubmitButton
        confirmMessage="Bạn có chắc muốn xóa dự án này không? Các công việc đang gắn dự án sẽ bị cập nhật lại liên kết."
        idleLabel="Xóa dự án"
        pendingLabel="Đang xóa dự án..."
        variant="destructive"
      />
    </form>
  );
}
