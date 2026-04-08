"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  buildProjectFormErrorState,
  type ProjectFormActionState,
  readProjectFormValues
} from "@/features/projects/actions/shared";
import { projectFormSchema } from "@/features/projects/schemas/project-schemas";
import { createProjectForUser } from "@/server/modules/projects/mutations";

export async function createProjectAction(
  _previousState: ProjectFormActionState,
  formData: FormData
): Promise<ProjectFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const values = readProjectFormValues(formData);
  const parsed = projectFormSchema.safeParse(values);

  if (!parsed.success) {
    return buildProjectFormErrorState(
      values,
      "Du lieu project chua hop le.",
      parsed.error.flatten().fieldErrors
    );
  }

  const projectId = await createProjectForUser(userId, parsed.data);

  if (!projectId) {
    return buildProjectFormErrorState(
      values,
      "Goal lien ket voi project khong hop le."
    );
  }

  revalidatePath("/projects");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  redirect(`/projects/${projectId}` as Route);
}
