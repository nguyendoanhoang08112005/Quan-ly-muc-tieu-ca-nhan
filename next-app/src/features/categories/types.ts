export const categoryTypeValues = ["goal", "task", "habit", "all"] as const;

export type CategoryType = (typeof categoryTypeValues)[number];

export type CategoryFormValues = {
  name: string;
  color: string;
  icon: string;
  type: CategoryType;
};

export type CategoryListItem = {
  id: string;
  name: string;
  slug: string | null;
  color: string | null;
  icon: string | null;
  type: CategoryType;
  goalsCount: number;
};
