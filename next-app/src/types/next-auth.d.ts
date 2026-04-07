import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      timezone: string | null;
      locale: string | null;
    };
  }

  interface User extends DefaultUser {
    id: string;
    timezone?: string | null;
    locale?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    timezone?: string | null;
    locale?: string | null;
  }
}
