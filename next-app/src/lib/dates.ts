const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function pad(value: number) {
  return `${value}`.padStart(2, "0");
}

export function isDateInput(value: string) {
  return DATE_INPUT_PATTERN.test(value);
}

export function parseDateInput(value: string) {
  if (!isDateInput(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDateInput(value: Date | null | undefined) {
  if (!value) {
    return "";
  }

  return [
    value.getUTCFullYear(),
    pad(value.getUTCMonth() + 1),
    pad(value.getUTCDate())
  ].join("-");
}

export function getTodayDateInput() {
  return formatDateInput(new Date());
}

export function addDaysToDateInput(value: string, days: number) {
  const baseDate = parseDateInput(value) ?? new Date();
  const nextDate = new Date(baseDate);

  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return formatDateInput(nextDate);
}

export function diffDateInputs(startDate: string, targetDate: string) {
  const start = parseDateInput(startDate);
  const target = parseDateInput(targetDate);

  if (!start || !target) {
    return null;
  }

  return Math.round((target.getTime() - start.getTime()) / DAY_IN_MILLISECONDS);
}

export function formatDisplayDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Chua co ngay";
  }

  const date =
    typeof value === "string"
      ? isDateInput(value)
        ? parseDateInput(value)
        : new Date(value)
      : value;

  if (!date || Number.isNaN(date.getTime())) {
    return "Chua co ngay";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}
