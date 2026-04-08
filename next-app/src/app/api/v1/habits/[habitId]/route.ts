import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { habitFormSchema } from "@/features/habits/schemas/habit-schemas";
import { readPartialHabitApiPayload } from "@/lib/api/v1/payloads";
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
import { serializeHabitResource } from "@/lib/api/v1/serializers";
import {
  softDeleteHabitForUser,
  updateHabitForUser
} from "@/server/modules/habits/mutations";
import {
  getHabitDetailForUser,
  getHabitFormValuesForUser
} from "@/server/modules/habits/queries";

type RouteContext = {
  params: Promise<{
    habitId: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { habitId } = await context.params;
  const parsedHabitId = parseRouteBigIntId(habitId);

  if (!parsedHabitId) {
    return jsonNotFoundResponse("Habit khong ton tai.");
  }

  const habit = await getHabitDetailForUser(auth.userId, parsedHabitId);

  if (!habit) {
    return jsonNotFoundResponse("Khong tim thay habit.");
  }

  return NextResponse.json({
    data: serializeHabitResource(habit)
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { habitId } = await context.params;
  const parsedHabitId = parseRouteBigIntId(habitId);

  if (!parsedHabitId) {
    return jsonNotFoundResponse("Habit khong ton tai.");
  }

  const existingValues = await getHabitFormValuesForUser(auth.userId, parsedHabitId);

  if (!existingValues) {
    return jsonNotFoundResponse("Khong tim thay habit.");
  }

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = habitFormSchema.safeParse({
    ...existingValues,
    ...readPartialHabitApiPayload(body)
  });

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const updatedHabitId = await updateHabitForUser(
    auth.userId,
    parsedHabitId,
    parsed.data
  );

  if (!updatedHabitId) {
    return jsonBadRequestResponse("Khong the cap nhat habit voi goal hien tai.");
  }

  const habit = await getHabitDetailForUser(auth.userId, parsedHabitId);

  if (!habit) {
    return jsonNotFoundResponse("Khong the tai lai habit sau cap nhat.");
  }

  revalidatePath("/habits");
  revalidatePath(`/habits/${updatedHabitId}`);

  return NextResponse.json({
    message: "Cap nhat habit thanh cong.",
    data: serializeHabitResource(habit)
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { habitId } = await context.params;
  const parsedHabitId = parseRouteBigIntId(habitId);

  if (!parsedHabitId) {
    return jsonNotFoundResponse("Habit khong ton tai.");
  }

  const deleted = await softDeleteHabitForUser(auth.userId, parsedHabitId);

  if (!deleted) {
    return jsonNotFoundResponse("Khong tim thay habit.");
  }

  revalidatePath("/habits");
  revalidatePath(`/habits/${habitId}`);

  return noContentResponse();
}
