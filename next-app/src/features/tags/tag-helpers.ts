import type { TagFormValues } from "@/features/tags/types";

export function buildDefaultTagFormValues(): TagFormValues {
  return {
    name: "",
    color: ""
  };
}
