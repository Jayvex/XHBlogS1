import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// 管理员账号配置
// 必须在 .env.local 中配置以下环境变量
const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || "",
  password: process.env.ADMIN_PASSWORD || "",
  name: process.env.ADMIN_NAME || "Admin",
  email: process.env.ADMIN_EMAIL || "",
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // 验证用户名和密码
        if (
          credentials.username === ADMIN_USER.username &&
          credentials.password === ADMIN_USER.password
        ) {
          return {
            id: "1",
            name: ADMIN_USER.name,
            email: ADMIN_USER.email,
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
});

// 检查用户是否为管理员
export function isAdmin(session: any): boolean {
  return session?.user?.role === "admin";
}

// 检查用户是否已登录
export function isAuthenticated(session: any): boolean {
  return !!session?.user;
}
