export type ProfileLocale = "vi" | "en";

export type ProfileFormValues = {
  avatarPath: string;
  email: string;
  locale: ProfileLocale;
  name: string;
  timezone: string;
};

export type ProfileSummary = {
  avatarPath: string | null;
  createdAt: string;
  email: string;
  emailVerifiedAt: string | null;
  id: string;
  locale: ProfileLocale;
  name: string;
  timezone: string;
  updatedAt: string;
};

export const profileLocaleLabels: Record<ProfileLocale, string> = {
  en: "English",
  vi: "Tieng Viet"
};

export const commonTimezoneOptions = [
  "Asia/Ho_Chi_Minh",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "UTC"
] as const;
