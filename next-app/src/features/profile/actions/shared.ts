import type { ProfileFormValues } from "@/features/profile/types";

type ProfileFormField = keyof ProfileFormValues;

export type ProfileSessionUpdatePayload = {
  email: string;
  image: string | null;
  locale: string;
  name: string;
  timezone: string;
};

export type ProfileFormActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<ProfileFormField, string[]>>;
  sessionUpdate?: ProfileSessionUpdatePayload;
  syncKey?: string;
  values: ProfileFormValues;
};

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function getInitialProfileFormActionState(
  values?: Partial<ProfileFormValues>
): ProfileFormActionState {
  return {
    status: "idle",
    values: {
      avatarPath: "",
      email: "",
      locale: "vi",
      name: "",
      timezone: "Asia/Ho_Chi_Minh",
      ...values
    }
  };
}

export function readProfileFormValues(formData: FormData): ProfileFormValues {
  return {
    avatarPath: readFormValue(formData, "avatarPath"),
    email: readFormValue(formData, "email"),
    locale: readFormValue(formData, "locale") as ProfileFormValues["locale"],
    name: readFormValue(formData, "name"),
    timezone: readFormValue(formData, "timezone")
  };
}

export function buildProfileFormErrorState(
  values: ProfileFormValues,
  message: string,
  fieldErrors?: ProfileFormActionState["fieldErrors"]
): ProfileFormActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    values
  };
}
