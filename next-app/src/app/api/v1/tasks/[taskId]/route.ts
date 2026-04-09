import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { workStatusValues } from "@/features/goals/types";
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
  reorderTaskForUser,
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

const taskReorderSchema = z.object({
  orderedTaskIds: z
    .array(z.string().regex(/^\d+$/, "Mã công việc không hợp lệ."))
    .min(1, "Danh sách sắp xếp không được để trống."),
  status: z.enum(workStatusValues, {
    message: "Trạng thái công việc không hợp lệ."
  })
});

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
    return jsonNotFoundResponse("Không tìm thấy task.");
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
    return jsonNotFoundResponse("Không tìm thấy task để cập nhật.");
  }

  const existingValues = await getTaskFormValuesForUser(
    auth.userId,
    goalId,
    parsedTaskId
  );

  if (!existingValues) {
    return jsonNotFoundResponse("Không tìm thấy task để cập nhật.");
  }

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  if (
    typeof body === "object" &&
    body !== null &&
    !Array.isArray(body) &&
    "ordered_task_ids" in body
  ) {
    const reorderBody = body as Record<string, unknown>;
    const parsedReorder = taskReorderSchema.safeParse({
      orderedTaskIds:
        Array.isArray(reorderBody.ordered_task_ids) &&
        reorderBody.ordered_task_ids.every(
          (value) => typeof value === "string" || typeof value === "number"
        )
          ? reorderBody.ordered_task_ids.map((value: string | number) => `${value}`)
          : reorderBody.ordered_task_ids,
      status:
        typeof reorderBody.status === "string"
          ? reorderBody.status
          : undefined
    });

    if (!parsedReorder.success) {
      return jsonValidationErrorResponse(parsedReorder.error);
    }

    const reorderedTaskId = await reorderTaskForUser(
      auth.userId,
      parsedTaskId,
      parsedReorder.data.status,
      parsedReorder.data.orderedTaskIds.map((value) => BigInt(value))
    );

    if (!reorderedTaskId) {
      return jsonBadRequestResponse("Không thể cập nhật thứ tự công việc này.");
    }

    const reorderedTask = await getTaskDetailForUser(auth.userId, parsedTaskId);

    if (!reorderedTask) {
      return jsonNotFoundResponse("Không thể tải lại task sau khi sắp xếp.");
    }

    revalidatePath("/goals");
    revalidatePath(`/goals/${goalId.toString()}`);
    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath("/projects");
    revalidatePath("/pomodoro");

    return NextResponse.json({
      message: "Cập nhật thứ tự công việc thành công.",
      data: serializeTaskApiResource(reorderedTask)
    });
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
    return jsonBadRequestResponse("Không thể cập nhật task này.");
  }

  const updatedTask = await getTaskDetailForUser(auth.userId, parsedTaskId);

  if (!updatedTask) {
    return jsonNotFoundResponse("Không thể tải lại task sau cập nhật.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId.toString()}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/pomodoro");

  return NextResponse.json({
    message: "Cập nhật task thành công.",
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
    return jsonNotFoundResponse("Không tìm thấy task để xóa.");
  }

  const deleted = await softDeleteTaskForGoal(auth.userId, goalId, parsedTaskId);

  if (!deleted) {
    return jsonNotFoundResponse("Không tìm thấy task để xóa.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId.toString()}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/pomodoro");

  return noContentResponse();
}
