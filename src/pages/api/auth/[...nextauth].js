import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const DUMMY_BASE =
  process.env.NEXT_PUBLIC_DUMMYJSON_BASE || "https://dummyjson.com";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" }, // for proxy/fallback login
        email: { label: "Email", type: "text" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
        id: { label: "ID", type: "text" },
      },

      async authorize(credentials) {
        // 1️⃣ SHORT-CIRCUIT: if token provided → trust frontend, skip DummyJSON
        if (credentials?.token) {
          console.log("NextAuth: accepting token from frontend (proxy login)");

          return {
            id: credentials.id || Math.random().toString(36).substr(2, 6),
            username: credentials.username || "fallbackUser",
            email: credentials.email || "fallback@example.com",
            firstName: credentials.firstName || "Fallback",
            lastName: credentials.lastName || "User",
            token: credentials.token,
          };
        }

        // 2️⃣ Otherwise → normal DummyJSON authentication
        try {
          console.log(
            "NextAuth authorize(): validating with DummyJSON:",
            credentials?.username
          );

          const resp = await axios.post(
            `${DUMMY_BASE}/auth/login`,
            {
              username: credentials.username,
              password: credentials.password,
            },
            { headers: { "Content-Type": "application/json" }, timeout: 8000 }
          );

          const user = resp.data;

          if (user?.token) {
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              token: user.token,
            };
          }

          return null;
        } catch (err) {
          console.error(
            "DummyJSON Login Error:",
            err.response?.data || err.message
          );
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },

  pages: { signIn: "/login" },

  secret: process.env.NEXTAUTH_SECRET,
});
