import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { buildDefaultTaskFormValues } from "@/features/tasks/task-helpers";
import { taskFormSchema } from "@/features/tasks/schemas/task-schemas";
import { readPartialTaskApiPayload } from "@/lib/api/v1/payloads";
import {
  getApiAuthenticatedUser,
  jsonBadRequestResponse,
  jsonNotFoundResponse,
  jsonUnauthorizedResponse,
  jsonValidationErrorResponse,
  parseRouteBigIntId,
  readJsonRequestBody
} from "@/lib/api/v1/route-helpers";
import { serializeTaskApiResource } from "@/lib/api/v1/serializers";
import { createTaskForMilestone } from "@/server/modules/tasks/mutations";
import { getTaskDetailForUser } from "@/server/modules/tasks/queries";
import { findMilestoneGoalIdForUser } from "@/server/modules/milestones/queries";

type MilestoneTasksRouteContext = {
  params: Promise<{
    milestoneId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: MilestoneTasksRouteContext
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
    return jsonNotFoundResponse("Khong tim thay milestone de tao task.");
  }

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = taskFormSchema.safeParse({
    ...buildDefaultTaskFormValues(),
    ...readPartialTaskApiPayload(body)
  });

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const taskId = await createTaskForMilestone(
    auth.userId,
    goalId,
    parsedMilestoneId,
    parsed.data
  );

  if (!taskId) {
    return jsonBadRequestResponse("Khong the tao task cho milestone nay.");
  }

  const parsedTaskId = parseRouteBigIntId(taskId);

  if (!parsedTaskId) {
    return jsonBadRequestResponse("Khong the doc id task vua tao.");
  }

  const task = await getTaskDetailForUser(auth.userId, parsedTaskId);

  if (!task) {
    return jsonNotFoundResponse("Khong the tai lai task vua tao.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId.toString()}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/pomodoro");

  return NextResponse.json(
    {
      message: "Tao task thanh cong.",
      data: serializeTaskApiResource(task)
    },
    {
      status: 201
    }
  );
}
