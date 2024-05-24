'use server';
import { Container, Typography } from '@mui/material';

export default async function Unauthorized(props: { roles?: string[] }) {
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
        {props.roles ? (
          <>
            Vous devez être <b>{props.roles.join(' ou ')}</b> pour accéder à
            cette ressource.
          </>
        ) : (
          <>Vous n&apos;êtes pas autorisé à accéder à cette ressource</>
        )}
      </Typography>
    </Container>
  );
}
