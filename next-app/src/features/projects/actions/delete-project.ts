"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { projectIdSchema } from "@/features/projects/schemas/project-schemas";
import { softDeleteProjectForUser } from "@/server/modules/projects/mutations";

export async function deleteProjectAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const projectId = formData.get("projectId");
  const parsedProjectId = projectIdSchema.safeParse(projectId);

  if (!parsedProjectId.success) {
    redirect("/projects");
  }

  await softDeleteProjectForUser(userId, BigInt(parsedProjectId.data));

  revalidatePath("/projects");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  redirect("/projects");
}
