'use server';

import { Box, Card, Typography } from '@mui/material';

export default async function Page() {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Hors-ligne
        </Typography>
      </Box>
      Vous n&apos;êtes pas connecté à Internet. Veuillez vérifier votre
      connexion.
      <br />
      La page se rechargera automatiquement dès que vous serez de nouveau
      connecté.
    </Card>
  );
}
