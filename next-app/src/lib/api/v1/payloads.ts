import type { GoalFormValues } from "@/features/goals/types";
import type {
  HabitFormValues,
  HabitLogFormValues
} from "@/features/habits/types";
import type { MilestoneFormValues } from "@/features/milestones/types";
import type { NoteFormValues } from "@/features/notes/types";
import type { ProfileFormValues } from "@/features/profile/types";
import type { TaskFormValues } from "@/features/tasks/types";

function asObject(payload: unknown) {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return null;
  }

  return payload as Record<string, unknown>;
}

function hasOwnKey(record: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function pickValue(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (hasOwnKey(record, key)) {
      return {
        found: true,
        value: record[key]
      };
    }
  }

  return {
    found: false,
    value: undefined
  };
}

function coerceString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  return "";
}

function coerceBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
  }

  return false;
}

function coerceStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (typeof item === "number") {
          return `${item}`;
        }

        return "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }

  if (typeof value === "number") {
    return [`${value}`];
  }

  return [];
}

export function readPartialGoalApiPayload(payload: unknown) {
  const body = asObject(payload);

  if (!body) {
    return {};
  }

  const values: Partial<GoalFormValues> = {};
  const title = pickValue(body, ["title"]);
  const description = pickValue(body, ["description"]);
  const goalType = pickValue(body, ["goalType", "goal_type"]);
  const priority = pickValue(body, ["priority"]);
  const status = pickValue(body, ["status"]);
  const startDate = pickValue(body, ["startDate", "start_date"]);
  const targetDate = pickValue(body, ["targetDate", "target_date", "due_date"]);
  const note = pickValue(body, ["note"]);
  const isPublic = pickValue(body, ["isPublic", "is_public"]);
  const categoryId = pickValue(body, ["categoryId", "category_id"]);
  const tagIds = pickValue(body, ["tagIds", "tag_ids"]);

  if (title.found) {
    values.title = coerceString(title.value);
  }

  if (description.found) {
    values.description = coerceString(description.value);
  }

  if (goalType.found) {
    values.goalType = coerceString(
      goalType.value
    ) as GoalFormValues["goalType"];
  }

  if (priority.found) {
    values.priority = coerceString(
      priority.value
    ) as GoalFormValues["priority"];
  }

  if (status.found) {
    values.status = coerceString(status.value) as GoalFormValues["status"];
  }

  if (startDate.found) {
    values.startDate = coerceString(startDate.value);
  }

  if (targetDate.found) {
    values.targetDate = coerceString(targetDate.value);
  }

  if (note.found) {
    values.note = coerceString(note.value);
  }

  if (isPublic.found) {
    values.isPublic = coerceBoolean(isPublic.value);
  }

  if (categoryId.found) {
    values.categoryId = coerceString(categoryId.value);
  }

  if (tagIds.found) {
    values.tagIds = coerceStringArray(tagIds.value);
  }

  return values;
}

export function readPartialMilestoneApiPayload(payload: unknown) {
  const body = asObject(payload);

  if (!body) {
    return {};
  }

  const values: Partial<MilestoneFormValues> = {};
  const title = pickValue(body, ["title"]);
  const description = pickValue(body, ["description"]);
  const status = pickValue(body, ["status"]);
  const startDate = pickValue(body, ["startDate", "start_date"]);
  const targetDate = pickValue(body, ["targetDate", "target_date"]);
  const note = pickValue(body, ["note"]);
  const sequenceNo = pickValue(body, ["sequenceNo", "sequence_no"]);

  if (title.found) {
    values.title = coerceString(title.value);
  }

  if (description.found) {
    values.description = coerceString(description.value);
  }

  if (status.found) {
    values.status = coerceString(status.value) as MilestoneFormValues["status"];
  }

  if (startDate.found) {
    values.startDate = coerceString(startDate.value);
  }

  if (targetDate.found) {
    values.targetDate = coerceString(targetDate.value);
  }

  if (note.found) {
    values.note = coerceString(note.value);
  }

  if (sequenceNo.found) {
    values.sequenceNo = coerceString(sequenceNo.value);
  }

  return values;
}

export function readPartialTaskApiPayload(payload: unknown) {
  const body = asObject(payload);

  if (!body) {
    return {};
  }

  const values: Partial<TaskFormValues> = {};
  const title = pickValue(body, ["title"]);
  const description = pickValue(body, ["description"]);
  const status = pickValue(body, ["status"]);
  const priority = pickValue(body, ["priority"]);
  const dueAt = pickValue(body, ["dueAt", "due_at"]);
  const estimatedMinutes = pickValue(body, [
    "estimatedMinutes",
    "estimated_minutes"
  ]);
  const projectId = pickValue(body, ["projectId", "project_id"]);
  const isFocus = pickValue(body, ["isFocus", "is_focus"]);

  if (title.found) {
    values.title = coerceString(title.value);
  }

  if (description.found) {
    values.description = coerceString(description.value);
  }

  if (status.found) {
    values.status = coerceString(status.value) as TaskFormValues["status"];
  }

  if (priority.found) {
    values.priority = coerceString(priority.value) as TaskFormValues["priority"];
  }

  if (dueAt.found) {
    values.dueAt = coerceString(dueAt.value);
  }

  if (estimatedMinutes.found) {
    values.estimatedMinutes = coerceString(estimatedMinutes.value);
  }

  if (projectId.found) {
    values.projectId = coerceString(projectId.value);
  }

  if (isFocus.found) {
    values.isFocus = coerceBoolean(isFocus.value);
  }

  return values;
}

export function readPartialProfileApiPayload(payload: unknown) {
  const body = asObject(payload);

  if (!body) {
    return {};
  }

  const values: Partial<ProfileFormValues> = {};
  const name = pickValue(body, ["name"]);
  const email = pickValue(body, ["email"]);
  const timezone = pickValue(body, ["timezone"]);
  const locale = pickValue(body, ["locale"]);
  const avatarPath = pickValue(body, ["avatarPath", "avatar_path"]);

  if (name.found) {
    values.name = coerceString(name.value);
  }

  if (email.found) {
    values.email = coerceString(email.value);
  }

  if (timezone.found) {
    values.timezone = coerceString(timezone.value);
  }

  if (locale.found) {
    values.locale = coerceString(locale.value) as ProfileFormValues["locale"];
  }

  if (avatarPath.found) {
    values.avatarPath = coerceString(avatarPath.value);
  }

  return values;
}

export function readPartialNoteApiPayload(payload: unknown) {
  const body = asObject(payload);

  if (!body) {
    return {};
  }

  const values: Partial<NoteFormValues> = {};
  const noteableType = pickValue(body, ["noteableType", "noteable_type"]);
  const noteableId = pickValue(body, ["noteableId", "noteable_id"]);
  const content = pickValue(body, ["content"]);

  if (noteableType.found) {
    values.noteableType = coerceString(
      noteableType.value
    ) as NoteFormValues["noteableType"];
  }

  if (noteableId.found) {
    values.noteableId = coerceString(noteableId.value);
  }

  if (content.found) {
    values.content = coerceString(content.value);
  }

  return values;
}

export function readPartialHabitApiPayload(payload: unknown) {
  const body = asObject(payload);

  if (!body) {
    return {};
  }

  const values: Partial<HabitFormValues> = {};
  const title = pickValue(body, ["title"]);
  const description = pickValue(body, ["description"]);
  const goalId = pickValue(body, ["goalId", "goal_id"]);
  const frequency = pickValue(body, ["frequency"]);
  const targetCount = pickValue(body, ["targetCount", "target_count"]);
  const unit = pickValue(body, ["unit"]);
  const reminderTime = pickValue(body, ["reminderTime", "reminder_time"]);
  const status = pickValue(body, ["status"]);
  const startDate = pickValue(body, ["startDate", "start_date"]);
  const endDate = pickValue(body, ["endDate", "end_date"]);

  if (title.found) {
    values.title = coerceString(title.value);
  }

  if (description.found) {
    values.description = coerceString(description.value);
  }

  if (goalId.found) {
    values.goalId = coerceString(goalId.value);
  }

  if (frequency.found) {
    values.frequency = coerceString(
      frequency.value
    ) as HabitFormValues["frequency"];
  }

  if (targetCount.found) {
    values.targetCount = coerceString(targetCount.value);
  }

  if (unit.found) {
    values.unit = coerceString(unit.value);
  }

  if (reminderTime.found) {
    values.reminderTime = coerceString(reminderTime.value);
  }

  if (status.found) {
    values.status = coerceString(status.value) as HabitFormValues["status"];
  }

  if (startDate.found) {
    values.startDate = coerceString(startDate.value);
  }

  if (endDate.found) {
    values.endDate = coerceString(endDate.value);
  }

  return values;
}

export function readPartialHabitLogApiPayload(payload: unknown) {
  const body = asObject(payload);

  if (!body) {
    return {};
  }

  const values: Partial<HabitLogFormValues> = {};
  const logDate = pickValue(body, ["logDate", "log_date"]);
  const completedCount = pickValue(body, ["completedCount", "completed_count"]);
  const note = pickValue(body, ["note"]);

  if (logDate.found) {
    values.logDate = coerceString(logDate.value);
  }

  if (completedCount.found) {
    values.completedCount = coerceString(completedCount.value);
  }

  if (note.found) {
    values.note = coerceString(note.value);
  }

  return values;
}
