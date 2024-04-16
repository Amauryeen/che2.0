import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Navbar from "@/components/navbar";
import { auth } from "@/auth";
import Unauthenticated from "@/components/unauthenticated";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth()
  if (!session) return <Unauthenticated />;

  return (
    <html lang="fr">
      <body>
        <AppRouterCacheProvider>
          <Navbar>{children}</Navbar>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
