'use client';

import { Box, Card, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function Download(props: { url: string }) {
  useEffect(() => {
    window.location.href = props.url + '?download=1';
  }, [props.url]);

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Téléchargement
        </Typography>
      </Box>
      Téléchargement de votre document en cours...
    </Card>
  );
}
