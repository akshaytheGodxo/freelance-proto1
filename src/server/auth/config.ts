import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";

/**
 * Extend NextAuth session types to include user ID.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/**
 * NextAuth.js configuration
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        const user = await db.user.findUnique({ where: { email } });

        if (!user) {
          throw new Error("Invalid email.");
        } else {
          console.log("User found");
        }

        console.log("Stored Hashed Password:", user.password);
    console.log("Entered Password:", credentials.password);
        const userPassword = user.password ?? "";
        const isValid = user.password === credentials.password;
        if (!isValid) {
          throw new Error("Invalid  password.");
        }

        return user;
      },
    }),

    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  adapter: PrismaAdapter(db),

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  
} satisfies NextAuthConfig;
