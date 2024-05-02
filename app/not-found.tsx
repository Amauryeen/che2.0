import { Container, Typography } from '@mui/material';

export default function NotFound() {
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
      <Typography variant="h2" gutterBottom sx={{ color: '#EE5B5B', fontFamily: 'Arial, sans-serif', textAlign: { xs: 'center', sm: 'left' } }}>
        <b>NON TROUVÉ</b>
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ marginBottom: '2rem', fontFamily: 'Arial, sans-serif', textAlign: { xs: 'center', sm: 'left' } }}>
        La page que vous essayez d&apos;atteindre n&apos;existe pas.
      </Typography>
    </Container>
  );
}