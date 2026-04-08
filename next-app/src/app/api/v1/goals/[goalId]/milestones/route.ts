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
  parseRouteBigIntId,
  readJsonRequestBody
} from "@/lib/api/v1/route-helpers";
import { serializeMilestoneApiResource } from "@/lib/api/v1/serializers";
import { createMilestoneForGoal } from "@/server/modules/milestones/mutations";
import { getMilestoneDetailForUser } from "@/server/modules/milestones/queries";
import { getGoalDetailForUser } from "@/server/modules/goals/queries";

type GoalMilestonesRouteContext = {
  params: Promise<{
    goalId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: GoalMilestonesRouteContext
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
    data: goal.milestones.map((milestone) => {
      return serializeMilestoneApiResource(milestone, auth.userId, goal.id);
    })
  });
}

export async function POST(
  request: Request,
  { params }: GoalMilestonesRouteContext
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

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = milestoneFormSchema.safeParse(readPartialMilestoneApiPayload(body));

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const milestoneId = await createMilestoneForGoal(auth.userId, parsedGoalId, parsed.data);

  if (!milestoneId) {
    return jsonBadRequestResponse("Không thể tạo milestone cho goal này.");
  }

  const parsedMilestoneId = parseRouteBigIntId(milestoneId);

  if (!parsedMilestoneId) {
    return jsonBadRequestResponse("Không thể đọc id milestone vừa tạo.");
  }

  const milestone = await getMilestoneDetailForUser(auth.userId, parsedMilestoneId);

  if (!milestone) {
    return jsonNotFoundResponse("Không thể tải lại milestone vừa tạo.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");

  return NextResponse.json(
    {
      message: "Tạo milestone thành công.",
      data: serializeMilestoneApiResource(
        milestone.milestone,
        auth.userId,
        milestone.goalId
      )
    },
    {
      status: 201
    }
  );
}
