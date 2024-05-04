import NextAuth from 'next-auth';
import AzureAD from 'next-auth/providers/azure-ad';
import { getUserByEmail } from '@/services/users';

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

      const existsInDatabase = await getUserByEmail(user.email);

      if (
        (user?.email?.endsWith('@ephec.be') ||
          user?.email?.endsWith('@students.ephec.be')) &&
        existsInDatabase
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
});
