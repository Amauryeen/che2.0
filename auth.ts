import NextAuth from "next-auth"
import AzureAD from "next-auth/providers/azure-ad"
import { PrismaClient } from "@prisma/client"
 
const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    AzureAD({
        clientId: process.env.AUTH_AZURE_AD_CLIENT,
        clientSecret: process.env.AUTH_AZURE_AD_SECRET,
        tenantId: process.env.AUTH_AZURE_AD_TENANT,
  })],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      const dbUser = await prisma.user.findUnique({
        where: {
          email: user.email
        }
      })

      if ((user?.email?.endsWith('@ephec.be') || user?.email?.endsWith('@students.ephec.be')) && dbUser) {
        return true
      } else {
        return false
      }
    }
  }
})