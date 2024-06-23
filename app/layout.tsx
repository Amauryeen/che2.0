import CssBaseline from '@mui/material/CssBaseline';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Navbar from '@/components/navbar';
import { auth, signIn } from '@/auth';
import Unauthenticated from '@/components/errors/unauthenticated';
import { Metadata, Viewport } from 'next';
import theme from '@/app/theme';
import { ThemeProvider } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import RegisterPWA from '@/components/register-pwa';

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

  async function logIn() {
    'use server';
    await signIn('azure-ad');
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <html lang="fr" suppressHydrationWarning>
        <Analytics />
        <body>
          <AppRouterCacheProvider>
            {session?.user?.email ? (
              <Navbar
                name={session.user.firstName + ' ' + session.user.lastName}
                email={session.user.email}
                deployment={process.env.VERCEL_DEPLOYMENT_ID}
              >
                <RegisterPWA />
                {children}
              </Navbar>
            ) : (
              <Unauthenticated logIn={logIn} />
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
