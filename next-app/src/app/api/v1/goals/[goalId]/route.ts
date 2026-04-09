import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { goalFormSchema } from "@/features/goals/schemas/goal-schemas";
import { readPartialGoalApiPayload } from "@/lib/api/v1/payloads";
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
import { serializeGoalResource } from "@/lib/api/v1/serializers";
import { softDeleteGoalForUser, updateGoalForUser } from "@/server/modules/goals/mutations";
import {
  getGoalDetailForUser,
  getGoalFormValuesForUser
} from "@/server/modules/goals/queries";

type GoalRouteContext = {
  params: Promise<{
    goalId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: GoalRouteContext
) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { goalId } = await params;
  const parsedGoalId = parseRouteBigIntId(goalId);

  if (!parsedGoalId) {
    return jsonBadRequestResponse("Goal id khong hop le.");
  }

  const goal = await getGoalDetailForUser(auth.userId, parsedGoalId);

  if (!goal) {
    return jsonNotFoundResponse("Không tìm thấy goal.");
  }

  return NextResponse.json({
    data: serializeGoalResource(goal, auth.userId)
  });
}

export async function PATCH(
  request: Request,
  { params }: GoalRouteContext
) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { goalId } = await params;
  const parsedGoalId = parseRouteBigIntId(goalId);

  if (!parsedGoalId) {
    return jsonBadRequestResponse("Goal id khong hop le.");
  }

  const existingValues = await getGoalFormValuesForUser(auth.userId, parsedGoalId);

  if (!existingValues) {
    return jsonNotFoundResponse("Không tìm thấy goal để cập nhật.");
  }

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = goalFormSchema.safeParse({
    ...existingValues,
    ...readPartialGoalApiPayload(body)
  });

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const updatedGoalId = await updateGoalForUser(auth.userId, parsedGoalId, parsed.data);

  if (!updatedGoalId.ok) {
    if (updatedGoalId.code === "not_found") {
      return jsonNotFoundResponse(updatedGoalId.message);
    }

    return jsonBadRequestResponse(updatedGoalId.message);
  }

  const updatedGoal = await getGoalDetailForUser(auth.userId, parsedGoalId);

  if (!updatedGoal) {
    return jsonNotFoundResponse("Không thể tải lại goal sau cập nhật.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath("/follows");

  return NextResponse.json({
    message: "Cập nhật mục tiêu thành công.",
    data: serializeGoalResource(updatedGoal, auth.userId)
  });
}

export async function DELETE(
  request: Request,
  { params }: GoalRouteContext
) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { goalId } = await params;
  const parsedGoalId = parseRouteBigIntId(goalId);

  if (!parsedGoalId) {
    return jsonBadRequestResponse("Goal id khong hop le.");
  }

  const deleted = await softDeleteGoalForUser(auth.userId, parsedGoalId);

  if (!deleted) {
    return jsonNotFoundResponse("Không tìm thấy goal để xóa.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath("/follows");

  return noContentResponse();
}
