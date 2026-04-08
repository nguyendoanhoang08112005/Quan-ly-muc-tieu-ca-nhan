import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { habitLogFormSchema } from "@/features/habits/schemas/habit-schemas";
import { readPartialHabitLogApiPayload } from "@/lib/api/v1/payloads";
import {
  getApiAuthenticatedUser,
  jsonBadRequestResponse,
  jsonNotFoundResponse,
  jsonUnauthorizedResponse,
  jsonValidationErrorResponse,
  parseRouteBigIntId,
  readJsonRequestBody
} from "@/lib/api/v1/route-helpers";
import { serializeHabitResource } from "@/lib/api/v1/serializers";
import { upsertHabitLogForUser } from "@/server/modules/habits/mutations";
import { getHabitDetailForUser } from "@/server/modules/habits/queries";

type RouteContext = {
  params: Promise<{
    habitId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { habitId } = await context.params;
  const parsedHabitId = parseRouteBigIntId(habitId);

  if (!parsedHabitId) {
    return jsonNotFoundResponse("Habit khong ton tai.");
  }

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = habitLogFormSchema.safeParse(readPartialHabitLogApiPayload(body));

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const updatedHabitId = await upsertHabitLogForUser(
    auth.userId,
    parsedHabitId,
    parsed.data
  );

  if (!updatedHabitId) {
    return jsonNotFoundResponse("Khong tim thay habit.");
  }

  const habit = await getHabitDetailForUser(auth.userId, parsedHabitId);

  if (!habit) {
    return jsonNotFoundResponse("Khong the tai lai habit sau khi log.");
  }

  revalidatePath("/habits");
  revalidatePath(`/habits/${updatedHabitId}`);
  revalidatePath("/dashboard");

  return NextResponse.json({
    message: "Cap nhat habit log thanh cong.",
    data: serializeHabitResource(habit)
  });
}
