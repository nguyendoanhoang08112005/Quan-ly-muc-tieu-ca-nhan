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
  parseRouteBigIntId,
  readJsonRequestBody
} from "@/lib/api/v1/route-helpers";
import { serializeHabitResource } from "@/lib/api/v1/serializers";
import { createHabitForUser } from "@/server/modules/habits/mutations";
import {
  getHabitDetailForUser,
  listHabitsForUser
} from "@/server/modules/habits/queries";

export async function GET(request: Request) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const habits = await listHabitsForUser(auth.userId);

  return NextResponse.json({
    data: habits.map((habit) => serializeHabitResource(habit))
  });
}

export async function POST(request: Request) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = habitFormSchema.safeParse(readPartialHabitApiPayload(body));

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const habitId = await createHabitForUser(auth.userId, parsed.data);

  if (!habitId) {
    return jsonBadRequestResponse("Goal lien ket khong hop le.");
  }

  const parsedHabitId = parseRouteBigIntId(habitId);

  if (!parsedHabitId) {
    return jsonBadRequestResponse("Không thể đọc id habit vừa tạo.");
  }

  const habit = await getHabitDetailForUser(auth.userId, parsedHabitId);

  if (!habit) {
    return jsonNotFoundResponse("Không thể tải lại habit vừa tạo.");
  }

  revalidatePath("/habits");
  revalidatePath(`/habits/${habitId}`);

  return NextResponse.json(
    {
      message: "Tạo habit thành công.",
      data: serializeHabitResource(habit)
    },
    {
      status: 201
    }
  );
}
