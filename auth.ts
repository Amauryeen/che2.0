import AzureAD from 'next-auth/providers/azure-ad';
import { getUserByEmail, setUserLastLogin } from '@/services/users';
import NextAuth, { type DefaultSession } from 'next-auth';
import { Role, User, UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: User & {
      roles: Array<UserRole> & { role: Role };
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    AzureAD({
      clientId: process.env.AUTH_AZURE_AD_ID,
      clientSecret: process.env.AUTH_AZURE_AD_SECRET,
      tenantId: process.env.AUTH_AZURE_AD_TENANT,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      const databaseUser = await getUserByEmail(user.email);

      if (!databaseUser) {
        return '/?error=not-found';
      } else if (databaseUser.status !== 'active') {
        return '/?error=inactive';
      } else {
        setUserLastLogin(databaseUser.id);
        return true;
      }
    },
    async jwt({ token }) {
      if (!token?.email) throw new Error('No email found in token');
      if (!token.user) {
        token.user = await getUserByEmail(token.email);
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  cookies: {
    sessionToken: {
      options: {
        maxAge: 60 * 60,
      },
    },
  },
  jwt: {
    maxAge: 60 * 60,
  },
  pages: {
    error: '/',
  },
});
