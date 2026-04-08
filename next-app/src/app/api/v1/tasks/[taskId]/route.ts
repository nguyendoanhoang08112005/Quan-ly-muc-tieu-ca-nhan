import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { taskFormSchema } from "@/features/tasks/schemas/task-schemas";
import { readPartialTaskApiPayload } from "@/lib/api/v1/payloads";
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
import { serializeTaskApiResource } from "@/lib/api/v1/serializers";
import {
  softDeleteTaskForGoal,
  updateTaskForGoal
} from "@/server/modules/tasks/mutations";
import {
  findTaskGoalIdForUser,
  getTaskDetailForUser,
  getTaskFormValuesForUser
} from "@/server/modules/tasks/queries";

type TaskRouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: TaskRouteContext
) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { taskId } = await params;
  const parsedTaskId = parseRouteBigIntId(taskId);

  if (!parsedTaskId) {
    return jsonBadRequestResponse("Task id khong hop le.");
  }

  const task = await getTaskDetailForUser(auth.userId, parsedTaskId);

  if (!task) {
    return jsonNotFoundResponse("Khong tim thay task.");
  }

  return NextResponse.json({
    data: serializeTaskApiResource(task)
  });
}

export async function PATCH(
  request: Request,
  { params }: TaskRouteContext
) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { taskId } = await params;
  const parsedTaskId = parseRouteBigIntId(taskId);

  if (!parsedTaskId) {
    return jsonBadRequestResponse("Task id khong hop le.");
  }

  const goalId = await findTaskGoalIdForUser(auth.userId, parsedTaskId);

  if (!goalId) {
    return jsonNotFoundResponse("Khong tim thay task de cap nhat.");
  }

  const existingValues = await getTaskFormValuesForUser(
    auth.userId,
    goalId,
    parsedTaskId
  );

  if (!existingValues) {
    return jsonNotFoundResponse("Khong tim thay task de cap nhat.");
  }

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = taskFormSchema.safeParse({
    ...existingValues,
    ...readPartialTaskApiPayload(body)
  });

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const updatedTaskId = await updateTaskForGoal(
    auth.userId,
    goalId,
    parsedTaskId,
    parsed.data
  );

  if (!updatedTaskId) {
    return jsonBadRequestResponse("Khong the cap nhat task nay.");
  }

  const updatedTask = await getTaskDetailForUser(auth.userId, parsedTaskId);

  if (!updatedTask) {
    return jsonNotFoundResponse("Khong the tai lai task sau cap nhat.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId.toString()}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/pomodoro");

  return NextResponse.json({
    message: "Cap nhat task thanh cong.",
    data: serializeTaskApiResource(updatedTask)
  });
}

export async function DELETE(
  request: Request,
  { params }: TaskRouteContext
) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { taskId } = await params;
  const parsedTaskId = parseRouteBigIntId(taskId);

  if (!parsedTaskId) {
    return jsonBadRequestResponse("Task id khong hop le.");
  }

  const goalId = await findTaskGoalIdForUser(auth.userId, parsedTaskId);

  if (!goalId) {
    return jsonNotFoundResponse("Khong tim thay task de xoa.");
  }

  const deleted = await softDeleteTaskForGoal(auth.userId, goalId, parsedTaskId);

  if (!deleted) {
    return jsonNotFoundResponse("Khong tim thay task de xoa.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId.toString()}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/pomodoro");

  return noContentResponse();
}
