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
  _request: Request,
  { params }: MilestoneRouteContext
) {
  const auth = await getApiAuthenticatedUser();

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
    return jsonNotFoundResponse("Khong tim thay milestone.");
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
  const auth = await getApiAuthenticatedUser();

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
    return jsonNotFoundResponse("Khong tim thay milestone de cap nhat.");
  }

  const existingValues = await getMilestoneFormValuesForUser(
    auth.userId,
    goalId,
    parsedMilestoneId
  );

  if (!existingValues) {
    return jsonNotFoundResponse("Khong tim thay milestone de cap nhat.");
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

  if (!updatedMilestoneId) {
    return jsonBadRequestResponse("Khong the cap nhat milestone nay.");
  }

  const updatedMilestone = await getMilestoneDetailForUser(
    auth.userId,
    parsedMilestoneId
  );

  if (!updatedMilestone) {
    return jsonNotFoundResponse("Khong the tai lai milestone sau cap nhat.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId.toString()}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");

  return NextResponse.json({
    message: "Cap nhat milestone thanh cong.",
    data: serializeMilestoneApiResource(
      updatedMilestone.milestone,
      auth.userId,
      updatedMilestone.goalId
    )
  });
}

export async function DELETE(
  _request: Request,
  { params }: MilestoneRouteContext
) {
  const auth = await getApiAuthenticatedUser();

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
    return jsonNotFoundResponse("Khong tim thay milestone de xoa.");
  }

  const deleted = await softDeleteMilestoneForGoal(
    auth.userId,
    goalId,
    parsedMilestoneId
  );

  if (!deleted) {
    return jsonNotFoundResponse("Khong tim thay milestone de xoa.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId.toString()}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");

  return noContentResponse();
}
