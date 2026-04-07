import { compare, hash } from "bcryptjs";

const BCRYPT_ROUNDS = 12;

function normalizeLegacyLaravelHash(value: string) {
  if (value.startsWith("$2y$")) {
    return `$2a$${value.slice(4)}`;
  }

  if (value.startsWith("$2x$")) {
    return `$2a$${value.slice(4)}`;
  }

  return value;
}

export async function hashPassword(password: string) {
  return hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, normalizeLegacyLaravelHash(passwordHash));
}
