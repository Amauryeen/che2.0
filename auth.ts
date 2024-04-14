import NextAuth from "next-auth"
import AzureAD from "next-auth/providers/azure-ad"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    AzureAD({
        clientId: process.env.AZURE_AD_CLIENT_ID,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
        tenantId: process.env.AZURE_AD_TENANT_ID,
  })],
})