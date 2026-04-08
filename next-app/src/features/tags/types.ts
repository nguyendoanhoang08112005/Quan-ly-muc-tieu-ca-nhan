export type TagFormValues = {
  name: string;
  color: string;
};

export type TagListItem = {
  id: string;
  name: string;
  color: string | null;
  goalsCount: number;
};
