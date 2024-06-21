'use server';

import { Box, Card, Typography } from '@mui/material';

export default async function Page() {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Bienvenue
        </Typography>
      </Box>
      Bienvenue sur CHE2.0!
    </Card>
  );
}
