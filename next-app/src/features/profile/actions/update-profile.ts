"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  buildProfileFormErrorState,
  type ProfileFormActionState,
  readProfileFormValues
} from "@/features/profile/actions/shared";
import { profileFormSchema } from "@/features/profile/schemas/profile-schemas";
import { updateProfileForUser } from "@/server/modules/profile/mutations";

export async function updateProfileAction(
  _previousState: ProfileFormActionState,
  formData: FormData
): Promise<ProfileFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const values = readProfileFormValues(formData);
  const parsedValues = profileFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return buildProfileFormErrorState(
      values,
      "Du lieu profile chua hop le.",
      parsedValues.error.flatten().fieldErrors
    );
  }

  const result = await updateProfileForUser(userId, parsedValues.data);

  if (result.status === "not_found") {
    return buildProfileFormErrorState(
      values,
      "Khong tim thay tai khoan de cap nhat."
    );
  }

  if (result.status === "email_taken") {
    return buildProfileFormErrorState(values, "Email nay da duoc su dung.", {
      email: ["Email nay da duoc su dung."]
    });
  }

  revalidatePath("/settings/profile");

  return {
    status: "success",
    message: "Cap nhat profile thanh cong.",
    sessionUpdate: {
      email: result.user.email,
      image: result.user.avatarPath,
      locale: result.user.locale,
      name: result.user.name,
      timezone: result.user.timezone
    },
    syncKey: `${Date.now()}`,
    values: {
      avatarPath: result.user.avatarPath ?? "",
      email: result.user.email,
      locale: result.user.locale as ProfileFormActionState["values"]["locale"],
      name: result.user.name,
      timezone: result.user.timezone
    }
  };
}
