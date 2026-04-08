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
import {
  projectFormSchema,
  projectIdSchema
} from "@/features/projects/schemas/project-schemas";
import { updateProjectForUser } from "@/server/modules/projects/mutations";

export async function updateProjectAction(
  _previousState: ProjectFormActionState,
  formData: FormData
): Promise<ProjectFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const projectId = formData.get("projectId");
  const parsedProjectId = projectIdSchema.safeParse(projectId);
  const values = readProjectFormValues(formData);
  const parsed = projectFormSchema.safeParse(values);

  if (!parsedProjectId.success) {
    return buildProjectFormErrorState(values, "Project khong hop le.");
  }

  if (!parsed.success) {
    return buildProjectFormErrorState(
      values,
      "Du lieu project chua hop le.",
      parsed.error.flatten().fieldErrors
    );
  }

  const updatedProjectId = await updateProjectForUser(
    userId,
    BigInt(parsedProjectId.data),
    parsed.data
  );

  if (!updatedProjectId) {
    return buildProjectFormErrorState(
      values,
      "Khong tim thay project hoac goal lien ket khong hop le."
    );
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${updatedProjectId}`);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  redirect(`/projects/${updatedProjectId}` as Route);
}
