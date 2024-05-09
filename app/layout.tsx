import CssBaseline from '@mui/material/CssBaseline';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Navbar from '@/components/navbar';
import { auth } from '@/auth';
import Unauthenticated from '@/components/errors/unauthenticated';
import { Metadata } from 'next';
import theme from '@/app/theme';
import { ThemeProvider } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'CHE2.0',
  description:
    "Plateforme de gestion des tâches numériques du Conseil des Étudiants de l'EPHEC",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <html lang="fr">
        <Analytics />
        <body>
          <AppRouterCacheProvider>
            {session?.user?.email ? (
              <Navbar
                name={session.user.lastName + ' ' + session.user.firstName}
                email={session.user.email}
              >
                {children}
              </Navbar>
            ) : (
              <Unauthenticated />
            )}
            <Toaster
              position="bottom-right"
              toastOptions={{ duration: 5000 }}
            />
          </AppRouterCacheProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
