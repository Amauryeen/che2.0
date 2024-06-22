'use client';

import { Box, Card, Typography } from '@mui/material';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function SignOut() {
  useEffect(() => {
    signOut({ callbackUrl: '/?success=sign-out' });
  }, []);

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Déconnexion
        </Typography>
      </Box>
      Déconnexion de votre compte en cours...
    </Card>
  );
}
