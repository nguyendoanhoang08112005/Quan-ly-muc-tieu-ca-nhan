export type RegisterField = "name" | "email" | "password" | "passwordConfirmation";

export type RegisterActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<RegisterField, string[]>>;
  values?: {
    name: string;
    email: string;
  };
};

export const initialRegisterActionState: RegisterActionState = {
  status: "idle",
  values: {
    name: "",
    email: ""
  }
};
