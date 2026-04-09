import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { milestoneFormSchema } from "@/features/milestones/schemas/milestone-schemas";
import { readPartialMilestoneApiPayload } from "@/lib/api/v1/payloads";
import {
  getApiAuthenticatedUser,
  jsonBadRequestResponse,
  jsonNotFoundResponse,
  jsonUnauthorizedResponse,
  jsonValidationErrorResponse,
  noContentResponse,
  parseRouteBigIntId,
  readJsonRequestBody
} from "@/lib/api/v1/route-helpers";
import { serializeMilestoneApiResource } from "@/lib/api/v1/serializers";
import {
  softDeleteMilestoneForGoal,
  updateMilestoneForGoal
} from "@/server/modules/milestones/mutations";
import {
  findMilestoneGoalIdForUser,
  getMilestoneDetailForUser,
  getMilestoneFormValuesForUser
} from "@/server/modules/milestones/queries";

type MilestoneRouteContext = {
  params: Promise<{
    milestoneId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: MilestoneRouteContext
) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { milestoneId } = await params;
  const parsedMilestoneId = parseRouteBigIntId(milestoneId);

  if (!parsedMilestoneId) {
    return jsonBadRequestResponse("Milestone id khong hop le.");
  }

  const milestone = await getMilestoneDetailForUser(auth.userId, parsedMilestoneId);

  if (!milestone) {
    return jsonNotFoundResponse("Không tìm thấy milestone.");
  }

  return NextResponse.json({
    data: serializeMilestoneApiResource(
      milestone.milestone,
      auth.userId,
      milestone.goalId
    )
  });
}

export async function PATCH(
  request: Request,
  { params }: MilestoneRouteContext
) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { milestoneId } = await params;
  const parsedMilestoneId = parseRouteBigIntId(milestoneId);

  if (!parsedMilestoneId) {
    return jsonBadRequestResponse("Milestone id khong hop le.");
  }

  const goalId = await findMilestoneGoalIdForUser(auth.userId, parsedMilestoneId);

  if (!goalId) {
    return jsonNotFoundResponse("Không tìm thấy milestone để cập nhật.");
  }

  const existingValues = await getMilestoneFormValuesForUser(
    auth.userId,
    goalId,
    parsedMilestoneId
  );

  if (!existingValues) {
    return jsonNotFoundResponse("Không tìm thấy milestone để cập nhật.");
  }

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = milestoneFormSchema.safeParse({
    ...existingValues,
    ...readPartialMilestoneApiPayload(body)
  });

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const updatedMilestoneId = await updateMilestoneForGoal(
    auth.userId,
    goalId,
    parsedMilestoneId,
    parsed.data
  );

  if (!updatedMilestoneId.ok) {
    if (updatedMilestoneId.code === "not_found") {
      return jsonNotFoundResponse(updatedMilestoneId.message);
    }

    return jsonBadRequestResponse(updatedMilestoneId.message);
  }

  const updatedMilestone = await getMilestoneDetailForUser(
    auth.userId,
    parsedMilestoneId
  );

  if (!updatedMilestone) {
    return jsonNotFoundResponse("Không thể tải lại milestone sau cập nhật.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId.toString()}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");

  return NextResponse.json({
    message: "Cập nhật milestone thành công.",
    data: serializeMilestoneApiResource(
      updatedMilestone.milestone,
      auth.userId,
      updatedMilestone.goalId
    )
  });
}

export async function DELETE(
  request: Request,
  { params }: MilestoneRouteContext
) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { milestoneId } = await params;
  const parsedMilestoneId = parseRouteBigIntId(milestoneId);

  if (!parsedMilestoneId) {
    return jsonBadRequestResponse("Milestone id khong hop le.");
  }

  const goalId = await findMilestoneGoalIdForUser(auth.userId, parsedMilestoneId);

  if (!goalId) {
    return jsonNotFoundResponse("Không tìm thấy milestone để xóa.");
  }

  const deleted = await softDeleteMilestoneForGoal(
    auth.userId,
    goalId,
    parsedMilestoneId
  );

  if (!deleted) {
    return jsonNotFoundResponse("Không tìm thấy milestone để xóa.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId.toString()}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");

  return noContentResponse();
}
