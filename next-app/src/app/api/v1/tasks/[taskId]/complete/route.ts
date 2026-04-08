import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  getApiAuthenticatedUser,
  jsonBadRequestResponse,
  jsonNotFoundResponse,
  jsonUnauthorizedResponse,
  parseRouteBigIntId
} from "@/lib/api/v1/route-helpers";
import { serializeTaskApiResource } from "@/lib/api/v1/serializers";
import { completeTaskForGoal } from "@/server/modules/tasks/mutations";
import { findTaskGoalIdForUser, getTaskDetailForUser } from "@/server/modules/tasks/queries";

type CompleteTaskRouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: CompleteTaskRouteContext
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
    return jsonNotFoundResponse("Không tìm thấy task để hoàn thành.");
  }

  const completed = await completeTaskForGoal(auth.userId, goalId, parsedTaskId);

  if (!completed) {
    return jsonNotFoundResponse("Không tìm thấy task để hoàn thành.");
  }

  const task = await getTaskDetailForUser(auth.userId, parsedTaskId);

  if (!task) {
    return jsonNotFoundResponse("Không thể tải lại task sau khi complete.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId.toString()}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/pomodoro");

  return NextResponse.json({
    message: "Hoan thanh task thanh cong.",
    data: serializeTaskApiResource(task)
  });
}
