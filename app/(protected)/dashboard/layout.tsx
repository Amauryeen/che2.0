import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
