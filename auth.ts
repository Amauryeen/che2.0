import AzureAD from 'next-auth/providers/azure-ad';
import { getUserByEmail } from '@/services/users';
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

      if (
        (user?.email?.endsWith('@ephec.be') ||
          user?.email?.endsWith('@students.ephec.be')) &&
        databaseUser
      ) {
        return true;
      } else {
        return false;
      }
    },
    async jwt({ token }) {
      if (!token?.email) throw new Error('No email found in token');
      if (!token.user) {
        const databaseUser = await getUserByEmail(token.email);
        token.user = databaseUser;
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
});
