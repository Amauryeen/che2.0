'use server';
import { CircularProgress, Container, Typography } from '@mui/material';

export default async function Loading() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
      <Typography variant="body1" sx={{ marginTop: '1rem' }}>
        Chargement...
      </Typography>
    </Container>
  );
}
