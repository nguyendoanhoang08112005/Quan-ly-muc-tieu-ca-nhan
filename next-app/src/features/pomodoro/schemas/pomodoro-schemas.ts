import { z } from "zod";

export const pomodoroSessionIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Pomodoro session id khong hop le.");

export const pomodoroStartFormSchema = z.object({
  taskId: z
    .string()
    .trim()
    .regex(/^\d+$/, "Task khong hop le."),
  durationMinutes: z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();

    return trimmed === "" ? undefined : Number(trimmed);
  }, z.number().int().min(1, "Pomodoro phai lon hon 0 phut.").max(180, "Pomodoro khong duoc vuot qua 180 phut."))
});

export type PomodoroStartFormInput = z.infer<typeof pomodoroStartFormSchema>;
