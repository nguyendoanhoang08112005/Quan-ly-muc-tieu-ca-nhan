import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual
} from "node:crypto";
import { getPrismaClient } from "@/lib/db/prisma";

const API_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
const API_TOKEN_TYPE = "api_session_v1";

type ApiSessionTokenPayload = {
  exp: number;
  iat: number;
  sid: string;
  sub: string;
  typ: typeof API_TOKEN_TYPE;
};

function getApiTokenSecret() {
  const secret = process.env["NEXTAUTH_SECRET"]?.trim();

  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required to issue API compatibility tokens.");
  }

  return secret;
}

function createSignature(encodedPayload: string) {
  return createHmac("sha256", getApiTokenSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function safeCompareStrings(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function hashSessionId(sessionId: string) {
  return createHash("sha256")
    .update(`${getApiTokenSecret()}:${sessionId}`)
    .digest("hex");
}

export function createSignedApiSessionToken(payload: ApiSessionTokenPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createSignature(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySignedApiSessionToken(token: string) {
  const [encodedPayload, signature, ...rest] = token.split(".");

  if (!encodedPayload || !signature || rest.length > 0) {
    return null;
  }

  const expectedSignature = createSignature(encodedPayload);

  if (!safeCompareStrings(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as Partial<ApiSessionTokenPayload>;

    if (
      payload.typ !== API_TOKEN_TYPE ||
      typeof payload.sub !== "string" ||
      !/^\d+$/.test(payload.sub) ||
      typeof payload.sid !== "string" ||
      payload.sid.length < 16 ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (payload.exp <= nowInSeconds) {
      return null;
    }

    return payload as ApiSessionTokenPayload;
  } catch {
    return null;
  }
}

export async function issueApiTokenForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const sessionId = randomBytes(24).toString("base64url");
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const token = createSignedApiSessionToken({
    exp: nowInSeconds + API_TOKEN_TTL_SECONDS,
    iat: nowInSeconds,
    sid: sessionId,
    sub: userId.toString(),
    typ: API_TOKEN_TYPE
  });

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      lastActiveAt: new Date(),
      rememberToken: hashSessionId(sessionId)
    }
  });

  return token;
}

export async function revokeApiTokenForUser(userId: bigint) {
  const prisma = getPrismaClient();

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      lastActiveAt: new Date(),
      rememberToken: null
    }
  });
}

export async function authenticateApiToken(token: string) {
  const payload = verifySignedApiSessionToken(token);

  if (!payload) {
    return null;
  }

  const prisma = getPrismaClient();
  const userId = BigInt(payload.sub);
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarPath: true,
      timezone: true,
      locale: true,
      rememberToken: true
    }
  });

  if (!user?.rememberToken) {
    return null;
  }

  const expectedRememberToken = hashSessionId(payload.sid);

  if (!safeCompareStrings(user.rememberToken, expectedRememberToken)) {
    return null;
  }

  return {
    authMethod: "bearer" as const,
    session: null,
    user: {
      email: user.email,
      id: user.id.toString(),
      image: user.avatarPath ?? null,
      locale: user.locale,
      name: user.name,
      timezone: user.timezone
    },
    userId: user.id
  };
}
