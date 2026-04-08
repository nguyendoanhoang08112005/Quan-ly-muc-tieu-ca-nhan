import type { MilestoneFormValues } from "@/features/milestones/types";
import { buildDefaultMilestoneFormValues } from "@/features/milestones/milestone-helpers";

type MilestoneFormField = keyof MilestoneFormValues;

export type MilestoneFormActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<MilestoneFormField, string[]>>;
  values: MilestoneFormValues;
};

export function getInitialMilestoneFormActionState(
  values?: Partial<MilestoneFormValues>
): MilestoneFormActionState {
  return {
    status: "idle",
    values: {
      ...buildDefaultMilestoneFormValues(),
      ...values
    }
  };
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function readMilestoneFormValues(formData: FormData): MilestoneFormValues {
  return {
    title: readFormValue(formData, "title"),
    description: readFormValue(formData, "description"),
    status: readFormValue(formData, "status") as MilestoneFormValues["status"],
    startDate: readFormValue(formData, "startDate"),
    targetDate: readFormValue(formData, "targetDate"),
    note: readFormValue(formData, "note"),
    sequenceNo: readFormValue(formData, "sequenceNo")
  };
}

export function buildMilestoneFormErrorState(
  values: MilestoneFormValues,
  message: string,
  fieldErrors?: MilestoneFormActionState["fieldErrors"]
): MilestoneFormActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    values
  };
}
