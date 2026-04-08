import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { noteFormSchema } from "@/features/notes/schemas/note-schemas";
import { readPartialNoteApiPayload } from "@/lib/api/v1/payloads";
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
import { serializeNoteResource } from "@/lib/api/v1/serializers";
import {
  softDeleteNoteForUser,
  updateNoteForUser
} from "@/server/modules/notes/mutations";
import {
  getNoteDetailForUser,
  getNoteFormValuesForUser
} from "@/server/modules/notes/queries";

type RouteContext = {
  params: Promise<{
    noteId: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { noteId } = await context.params;
  const parsedNoteId = parseRouteBigIntId(noteId);

  if (!parsedNoteId) {
    return jsonNotFoundResponse("Note khong ton tai.");
  }

  const note = await getNoteDetailForUser(auth.userId, parsedNoteId);

  if (!note) {
    return jsonNotFoundResponse("Khong tim thay note.");
  }

  return NextResponse.json({
    data: serializeNoteResource(note)
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { noteId } = await context.params;
  const parsedNoteId = parseRouteBigIntId(noteId);

  if (!parsedNoteId) {
    return jsonNotFoundResponse("Note khong ton tai.");
  }

  const existingValues = await getNoteFormValuesForUser(auth.userId, parsedNoteId);

  if (!existingValues) {
    return jsonNotFoundResponse("Khong tim thay note.");
  }

  const body = await readJsonRequestBody(request);

  if (body === null) {
    return jsonBadRequestResponse("Body JSON khong hop le.");
  }

  const parsed = noteFormSchema.safeParse({
    ...existingValues,
    ...readPartialNoteApiPayload(body)
  });

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const updatedNoteId = await updateNoteForUser(auth.userId, parsedNoteId, parsed.data);

  if (!updatedNoteId) {
    return jsonBadRequestResponse("Khong the cap nhat note voi doi tuong hien tai.");
  }

  const note = await getNoteDetailForUser(auth.userId, parsedNoteId);

  if (!note) {
    return jsonNotFoundResponse("Khong the tai lai note sau cap nhat.");
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${updatedNoteId}/edit`);

  return NextResponse.json({
    message: "Cap nhat ghi chu thanh cong.",
    data: serializeNoteResource(note)
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const { noteId } = await context.params;
  const parsedNoteId = parseRouteBigIntId(noteId);

  if (!parsedNoteId) {
    return jsonNotFoundResponse("Note khong ton tai.");
  }

  const deleted = await softDeleteNoteForUser(auth.userId, parsedNoteId);

  if (!deleted) {
    return jsonNotFoundResponse("Khong tim thay note.");
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${noteId}/edit`);

  return noContentResponse();
}
