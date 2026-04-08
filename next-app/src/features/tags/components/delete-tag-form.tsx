import { deleteTagAction } from "@/features/tags/actions/delete-tag";
import { Button } from "@/components/ui/button";

export function DeleteTagForm({ tagId }: { tagId: string }) {
  return (
    <form action={deleteTagAction}>
      <input name="tagId" type="hidden" value={tagId} />
      <Button type="submit" variant="destructive">
        Xóa thẻ
      </Button>
    </form>
  );
}
