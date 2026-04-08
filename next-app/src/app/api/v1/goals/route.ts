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
  parseRouteBigIntId,
  readJsonRequestBody
} from "@/lib/api/v1/route-helpers";
import { serializeGoalResource } from "@/lib/api/v1/serializers";
import { createGoalForUser } from "@/server/modules/goals/mutations";
import { getGoalDetailForUser, listGoalsForUser } from "@/server/modules/goals/queries";

export async function GET() {
  const auth = await getApiAuthenticatedUser();

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const goals = await listGoalsForUser(auth.userId);

  return NextResponse.json({
    data: goals.map((goal) => serializeGoalResource(goal, auth.userId))
  });
}

export async function POST(request: Request) {
  const auth = await getApiAuthenticatedUser();

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = goalFormSchema.safeParse(readPartialGoalApiPayload(body));

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const goalId = await createGoalForUser(auth.userId, parsed.data);

  if (!goalId) {
    return jsonBadRequestResponse("Category hoac tag khong hop le.");
  }

  const parsedGoalId = parseRouteBigIntId(goalId);

  if (!parsedGoalId) {
    return jsonBadRequestResponse("Khong the doc id goal vua tao.");
  }

  const goal = await getGoalDetailForUser(auth.userId, parsedGoalId);

  if (!goal) {
    return jsonNotFoundResponse("Khong the tai lai goal vua tao.");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId}`);
  revalidatePath("/dashboard");
  revalidatePath("/follows");

  return NextResponse.json(
    {
      message: "Tao muc tieu thanh cong.",
      data: serializeGoalResource(goal, auth.userId)
    },
    {
      status: 201
    }
  );
}
