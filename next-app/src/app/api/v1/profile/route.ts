import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { profileFormSchema } from "@/features/profile/schemas/profile-schemas";
import { readPartialProfileApiPayload } from "@/lib/api/v1/payloads";
import {
  getApiAuthenticatedUser,
  jsonBadRequestResponse,
  jsonNotFoundResponse,
  jsonUnauthorizedResponse,
  jsonValidationErrorResponse,
  readJsonRequestBody
} from "@/lib/api/v1/route-helpers";
import { serializeUserResource } from "@/lib/api/v1/serializers";
import { updateProfileForUser } from "@/server/modules/profile/mutations";
import { getProfileSummaryForUser } from "@/server/modules/profile/queries";

export async function PATCH(request: Request) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const currentProfile = await getProfileSummaryForUser(auth.userId);

  if (!currentProfile) {
    return jsonNotFoundResponse("Khong tim thay profile de cap nhat.");
  }

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = profileFormSchema.safeParse({
    avatarPath: currentProfile.avatarPath ?? "",
    email: currentProfile.email,
    locale: currentProfile.locale,
    name: currentProfile.name,
    timezone: currentProfile.timezone,
    ...readPartialProfileApiPayload(body)
  });

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const result = await updateProfileForUser(auth.userId, parsed.data);

  if (result.status === "not_found") {
    return jsonNotFoundResponse("Khong tim thay profile de cap nhat.");
  }

  if (result.status === "email_taken") {
    return NextResponse.json(
      {
        message: "Email nay da duoc su dung.",
        errors: {
          email: ["Email nay da duoc su dung."]
        }
      },
      {
        status: 422
      }
    );
  }

  const updatedProfile = await getProfileSummaryForUser(auth.userId);

  if (!updatedProfile) {
    return jsonNotFoundResponse("Khong the tai lai profile sau cap nhat.");
  }

  revalidatePath("/settings/profile");
  revalidatePath("/dashboard");

  return NextResponse.json({
    message: "Cap nhat profile thanh cong.",
    user: serializeUserResource(updatedProfile)
  });
}
