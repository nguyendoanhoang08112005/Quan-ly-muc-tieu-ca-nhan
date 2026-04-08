const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_LOCAL_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const TIME_INPUT_PATTERN = /^\d{2}:\d{2}$/;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function pad(value: number) {
  return `${value}`.padStart(2, "0");
}

export function isDateInput(value: string) {
  return DATE_INPUT_PATTERN.test(value);
}

export function isDateTimeLocalInput(value: string) {
  return DATE_TIME_LOCAL_PATTERN.test(value);
}

export function isTimeInput(value: string) {
  return TIME_INPUT_PATTERN.test(value);
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

export function parseDateTimeLocalInput(value: string) {
  if (!isDateTimeLocalInput(value)) {
    return null;
  }

  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function parseTimeInput(value: string) {
  if (!isTimeInput(value)) {
    return null;
  }

  const [hours, minutes] = value.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));
}

export function formatDateTimeLocalInput(
  value: Date | string | null | undefined
) {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join("-") + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatTimeInput(value: Date | string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
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

export function formatDisplayDateTime(value: Date | string | null | undefined) {
  if (!value) {
    return "Chua co han";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "Chua co han";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}
