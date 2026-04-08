export type OwnedRecordLike = {
  userId: bigint | number | string;
  deletedAt?: Date | string | null;
};

function normalizeOwnedUserId(value: bigint | number | string) {
  if (typeof value === "bigint") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return BigInt(Math.trunc(value));
  }

  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    return BigInt(value.trim());
  }

  return null;
}

export function isActiveOwnedRecord(
  userId: bigint,
  record: OwnedRecordLike | null | undefined
) {
  if (!record) {
    return false;
  }

  const normalizedRecordUserId = normalizeOwnedUserId(record.userId);

  if (normalizedRecordUserId === null || normalizedRecordUserId !== userId) {
    return false;
  }

  return record.deletedAt === null || record.deletedAt === undefined;
}

export function getOwnershipAccessState(
  userId: bigint,
  record: OwnedRecordLike | null | undefined
) {
  if (!record) {
    return "missing" as const;
  }

  const normalizedRecordUserId = normalizeOwnedUserId(record.userId);

  if (normalizedRecordUserId === null || normalizedRecordUserId !== userId) {
    return "forbidden" as const;
  }

  if (record.deletedAt !== null && record.deletedAt !== undefined) {
    return "deleted" as const;
  }

  return "allowed" as const;
}
