import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// 管理员账号配置
// 必须在 .env.local 中配置以下环境变量
const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || "",
  password: process.env.ADMIN_PASSWORD || "",
  name: process.env.ADMIN_NAME || "Admin",
  email: process.env.ADMIN_EMAIL || "",
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "用户名", type: "text", placeholder: "输入用户名" },
        password: { label: "密码", type: "password", placeholder: "输入密码" },
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
            role: "admin", // 管理员角色
          };
        }

        // 认证失败
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // 登录时将用户信息添加到 token
      if (user) {
        token.role = (user as any).role || "user";
        token.username = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      // 将 token 信息添加到 session
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // 登录成功后重定向到发布页面
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login", // 自定义登录页面
    error: "/login", // 错误页面
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },

  secret: process.env.NEXTAUTH_SECRET || "please-set-nextauth-secret-in-env",
};

// 检查用户是否为管理员
export function isAdmin(session: any): boolean {
  return session?.user?.role === "admin";
}

// 检查用户是否已登录
export function isAuthenticated(session: any): boolean {
  return !!session?.user;
}
