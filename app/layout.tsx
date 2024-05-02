import CssBaseline from '@mui/material/CssBaseline';
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Navbar from "@/components/navbar";
import { auth } from "@/auth";
import Unauthenticated from "@/components/unauthenticated";
import { Metadata } from "next";
import theme from "@/app/theme";
import { ThemeProvider } from '@mui/material';

export const metadata: Metadata = {
  title: "CHE2.0",
  description: "Plateforme de gestion des tâches numériques du Conseil des Étudiants de l'EPHEC",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth() 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <html lang="fr">
        <body>
          <AppRouterCacheProvider>
            {session?.user?.email && session.user.name ? <Navbar name={session.user.name} email={session.user.email}>{children}</Navbar> : <Unauthenticated />}
          </AppRouterCacheProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}