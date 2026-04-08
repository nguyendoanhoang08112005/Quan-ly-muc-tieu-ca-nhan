export type SearchParamValue = string | string[] | undefined;

export function getSingleSearchParam(value: SearchParamValue) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return "";
}

export function matchesSearchTerm(
  searchTerm: string,
  values: Array<string | null | undefined>
) {
  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase("vi");

  if (!normalizedSearchTerm) {
    return true;
  }

  return values.some((value) => {
    if (!value) {
      return false;
    }

    return value.toLocaleLowerCase("vi").includes(normalizedSearchTerm);
  });
}
