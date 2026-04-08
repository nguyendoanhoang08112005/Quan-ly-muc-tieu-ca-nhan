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
  parseRouteBigIntId,
  readJsonRequestBody
} from "@/lib/api/v1/route-helpers";
import { serializeNoteResource } from "@/lib/api/v1/serializers";
import { createNoteForUser } from "@/server/modules/notes/mutations";
import {
  getNoteDetailForUser,
  listNotesForUser
} from "@/server/modules/notes/queries";

export async function GET(request: Request) {
  const auth = await getApiAuthenticatedUser(request);

  if (!auth) {
    return jsonUnauthorizedResponse();
  }

  const notes = await listNotesForUser(auth.userId);

  return NextResponse.json({
    data: notes.map((note) => serializeNoteResource(note))
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

  const parsed = noteFormSchema.safeParse(readPartialNoteApiPayload(body));

  if (!parsed.success) {
    return jsonValidationErrorResponse(parsed.error);
  }

  const noteId = await createNoteForUser(auth.userId, parsed.data);

  if (!noteId) {
    return jsonBadRequestResponse("Doi tuong ghi chu khong hop le.");
  }

  const parsedNoteId = parseRouteBigIntId(noteId);

  if (!parsedNoteId) {
    return jsonBadRequestResponse("Khong the doc id note vua tao.");
  }

  const note = await getNoteDetailForUser(auth.userId, parsedNoteId);

  if (!note) {
    return jsonNotFoundResponse("Khong the tai lai note vua tao.");
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${noteId}/edit`);

  return NextResponse.json(
    {
      message: "Tao ghi chu thanh cong.",
      data: serializeNoteResource(note)
    },
    {
      status: 201
    }
  );
}
