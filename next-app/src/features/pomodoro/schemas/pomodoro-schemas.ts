import { z } from "zod";

export const pomodoroSessionIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Mã phiên pomodoro không hợp lệ.");

export const pomodoroStartFormSchema = z.object({
  taskId: z
    .string()
    .trim()
    .regex(/^\d+$/, "Công việc không hợp lệ."),
  durationMinutes: z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();

    return trimmed === "" ? undefined : Number(trimmed);
  }, z.number().int().min(1, "Pomodoro phải lớn hơn 0 phút.").max(180, "Pomodoro không được vượt quá 180 phút."))
});

export type PomodoroStartFormInput = z.infer<typeof pomodoroStartFormSchema>;
