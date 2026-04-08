const CATEGORY_TYPE_MAP = {
  all: "ALL",
  goal: "GOAL",
  habit: "HABIT",
  task: "TASK"
};

const GOAL_TYPE_MAP = {
  long_term: "LONG_TERM",
  mid_term: "MID_TERM",
  short_term: "SHORT_TERM"
};

const PRIORITY_MAP = {
  critical: "CRITICAL",
  high: "HIGH",
  low: "LOW",
  medium: "MEDIUM"
};

const GOAL_STATUS_MAP = {
  cancelled: "CANCELLED",
  completed: "COMPLETED",
  in_progress: "IN_PROGRESS",
  not_started: "NOT_STARTED",
  paused: "PAUSED"
};

const WORK_STATUS_MAP = {
  completed: "COMPLETED",
  in_progress: "IN_PROGRESS",
  not_started: "NOT_STARTED",
  paused: "PAUSED"
};

const GOAL_LOG_TYPE_MAP = {
  ai_suggestion: "AI_SUGGESTION",
  completion: "COMPLETION",
  note: "NOTE",
  progress_update: "PROGRESS_UPDATE",
  risk: "RISK",
  status_change: "STATUS_CHANGE"
};

function mapLegacyEnum(value, mapping, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  return mapping[value.toLowerCase()] ?? fallback;
}

export function mapLegacyCategoryType(value) {
  return mapLegacyEnum(value, CATEGORY_TYPE_MAP, "GOAL");
}

export function mapLegacyGoalType(value) {
  return mapLegacyEnum(value, GOAL_TYPE_MAP, "SHORT_TERM");
}

export function mapLegacyPriority(value) {
  return mapLegacyEnum(value, PRIORITY_MAP, "MEDIUM");
}

export function mapLegacyGoalStatus(value) {
  return mapLegacyEnum(value, GOAL_STATUS_MAP, "NOT_STARTED");
}

export function mapLegacyWorkStatus(value) {
  return mapLegacyEnum(value, WORK_STATUS_MAP, "NOT_STARTED");
}

export function mapLegacyGoalLogType(value) {
  return mapLegacyEnum(value, GOAL_LOG_TYPE_MAP, "NOTE");
}

export function parseLegacyJson(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "object") {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function toBigIntOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "bigint") {
    return value;
  }

  if (typeof value === "number") {
    return BigInt(Math.trunc(value));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed || !/^-?\d+$/.test(trimmed)) {
      return null;
    }

    return BigInt(trimmed);
  }

  return null;
}

export function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "bigint") {
    return value === 1n;
  }

  if (typeof value === "string") {
    return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
  }

  return false;
}

export function toIntOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.trunc(value) : null;
  }

  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "string") {
    const normalized = Number(value);

    return Number.isFinite(normalized) ? Math.trunc(normalized) : null;
  }

  return null;
}

export function toDecimalOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "string") {
    const normalized = Number(value);

    return Number.isFinite(normalized) ? normalized : null;
  }

  return null;
}

export function toDateOrNull(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function toDateOrNow(value) {
  return toDateOrNull(value) ?? new Date();
}

export function chunkArray(items, size = 200) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}
