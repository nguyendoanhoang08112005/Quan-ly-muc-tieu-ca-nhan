import type { MilestoneFormValues } from "@/features/milestones/types";
import { getTodayDateInput } from "@/lib/dates";

export function buildDefaultMilestoneFormValues(): MilestoneFormValues {
  const today = getTodayDateInput();

  return {
    title: "",
    description: "",
    status: "not_started",
    startDate: today,
    targetDate: today,
    note: "",
    sequenceNo: ""
  };
}
