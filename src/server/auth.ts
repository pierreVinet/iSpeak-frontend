import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { User } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email),
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.password) {
            throw new Error("Invalid user data");
          }

          const isValid = await compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error("Incorrect password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split("@")[0],
          };
        } catch (error) {
          // Handle database connection errors
          if (error instanceof Error) {
            if (
              error.message.includes("connection") ||
              error.message.includes("ECONNREFUSED") ||
              error.message.toLowerCase().includes("timeout")
            ) {
              throw new Error(
                "Database connection error - Please try again later"
              );
            }
            // Re-throw the specific error messages we created above
            if (
              error.message === "No user found with this email" ||
              error.message === "Invalid user data" ||
              error.message === "Incorrect password"
            ) {
              throw error;
            }
          }
          // For any other unexpected errors
          throw new Error(
            "Authentication service unavailable - Please try again later"
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export async function createUser(
  email: string,
  password: string,
  name?: string
) {
  const hashedPassword = await hashPassword(password);

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
    })
    .returning();

  return user[0];
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
