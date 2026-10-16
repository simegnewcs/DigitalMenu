import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      try {
        const candidateUrl = new URL(url);
        const currentBaseUrl = new URL(baseUrl);
        // Allows callback URLs on the same origin
        if (candidateUrl.origin === currentBaseUrl.origin) {
          return url;
        }
        // If current origin is localhost/127.0.0.1, always keep on localhost!
        if (currentBaseUrl.hostname === "localhost" || currentBaseUrl.hostname === "127.0.0.1") {
          return `${currentBaseUrl.origin}${candidateUrl.pathname}${candidateUrl.search}`;
        }
      } catch (e) {}
      return baseUrl;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
