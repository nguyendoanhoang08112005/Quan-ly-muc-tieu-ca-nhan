import type { WorkStatus } from "@/features/goals/types";

export type MilestoneFormValues = {
  title: string;
  description: string;
  status: WorkStatus;
  startDate: string;
  targetDate: string;
  note: string;
  sequenceNo: string;
};
