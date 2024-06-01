import CssBaseline from '@mui/material/CssBaseline';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Navbar from '@/components/navbar';
import { auth } from '@/auth';
import Unauthenticated from '@/components/errors/unauthenticated';
import { Metadata, Viewport } from 'next';
import theme from '@/app/theme';
import { ThemeProvider } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  applicationName: 'CHE2.0',
  title: 'CHE2.0',
  description:
    "Plateforme de gestion des tâches numériques du Conseil des Étudiants de l'EPHEC",
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#272727',
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
      <html lang="fr" suppressHydrationWarning>
        <Analytics />
        <body>
          <AppRouterCacheProvider>
            {session?.user?.email ? (
              <Navbar
                name={session.user.lastName + ' ' + session.user.firstName}
                email={session.user.email}
                deployment={process.env.VERCEL_DEPLOYMENT_ID}
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
