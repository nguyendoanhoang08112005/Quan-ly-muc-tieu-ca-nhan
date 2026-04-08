import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getPrismaClient } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { authRoutes } from "@/lib/auth/routes";
import { loginSchema } from "@/features/auth/schemas/auth-schemas";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: authRoutes.signIn
  },
  secret: process.env["NEXTAUTH_SECRET"],
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Email va mat khau",
      credentials: {
        email: {
          label: "Email",
          type: "email"
        },
        password: {
          label: "Mat khau",
          type: "password"
        }
      },
      async authorize(credentials) {
        const prisma = getPrismaClient();
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email
          },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            avatarPath: true,
            timezone: true,
            locale: true,
            deletedAt: true
          }
        });

        if (!user || user.deletedAt) {
          return null;
        }

        const isPasswordValid = await verifyPassword(
          parsed.data.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatarPath,
          timezone: user.timezone,
          locale: user.locale
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image ?? null;
        token.timezone = user.timezone ?? null;
        token.locale = user.locale ?? null;
      }

      if (trigger === "update" && session) {
        if (typeof session.name === "string") {
          token.name = session.name;
        }

        if (typeof session.email === "string") {
          token.email = session.email;
        }

        if ("image" in session) {
          token.picture = typeof session.image === "string" ? session.image : null;
        }

        if (typeof session.timezone === "string") {
          token.timezone = session.timezone;
        }

        if (typeof session.locale === "string") {
          token.locale = session.locale;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.name =
          typeof token.name === "string" ? token.name : session.user.name;
        session.user.email =
          typeof token.email === "string" ? token.email : session.user.email;
        session.user.image =
          typeof token.picture === "string" ? token.picture : null;
        session.user.timezone =
          typeof token.timezone === "string" ? token.timezone : null;
        session.user.locale =
          typeof token.locale === "string" ? token.locale : null;
      }

      return session;
    }
  }
};
