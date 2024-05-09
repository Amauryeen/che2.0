'use server';
import { Button, Container, Typography } from '@mui/material';
import { signIn } from '@/auth';

export default async function Unauthenticated() {
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
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          color: '#EE5B5B',
          fontFamily: 'Arial, sans-serif',
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <b>ACCÈS REFUSÉ</b>
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          marginBottom: '2rem',
          fontFamily: 'Arial, sans-serif',
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        Vous devez être connecté pour accéder à cette ressource.
      </Typography>

      <form
        action={async () => {
          'use server';
          await signIn('azure-ad');
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Se connecter
        </Button>
      </form>
    </Container>
  );
}
