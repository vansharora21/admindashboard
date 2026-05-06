import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // STATIC LOGIN BYPASS (Always returns a valid user)
        return {
          id: 1,
          username: credentials?.username || "admin",
          email: "admin@studyabroad.com",
          firstName: "System",
          lastName: "Administrator",
          gender: "other",
          image: "https://robohash.org/admin.png",
          token: "static-mock-token-12345"
        };

        /* 
        // Real API Code (Commented out)
        try {
          const res = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });
          const user = await res.json();
          if (res.ok && user) return user;
          return null;
        } catch (error) {
          return null;
        }
        */
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev",
};
