'use client';

import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Unauthenticated(props: any) {
  const error = useSearchParams().get('error');

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
      maxWidth={'lg'}
    >
      <Box sx={{ flex: '1 0 auto' }}>
        {error && (
          <Box
            border={2}
            borderColor="error.main"
            borderRadius={5}
            p={2}
            mt={5}
          >
            <Typography align="center">
              {error === 'not-found'
                ? "Votre compte n'existe pas dans la base de données. Veuillez contacter un/une Gestionnaire si vous pensez qu'il s'agit d'une erreur."
                : error === 'inactive'
                  ? "Votre compte est inactif. Veuillez contacter un/une Gestionnaire si vous pensez qu'il s'agit d'une erreur."
                  : 'Une erreur inconnue est survenue. Veuillez contacter un/une Gestionnaire.'}
            </Typography>
          </Box>
        )}
        <Box display="flex" justifyContent="center">
          <Image
            src={'/icon.png'}
            alt={'Logo du CHE2'}
            width={250}
            height={250}
          />
        </Box>
        <Typography variant="h2" align="center" gutterBottom>
          CHE2.0
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          Plateforme de gestion des tâches numériques du Conseil des Étudiants
          de l&apos;EPHEC
        </Typography>
        <form action={props.logIn}>
          <Button
            type={'submit'}
            variant={'contained'}
            size="large"
            fullWidth={true}
            sx={{ mt: 5, p: 2 }}
          >
            Se connecter
          </Button>
        </form>
      </Box>
      <footer style={{ flexShrink: 0 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding={2}
        >
          <Typography variant="body2" noWrap component="div" sx={{ mt: 5 }}>
            <Link href="https://github.com/Amauryeen">
              © 2024 Amaury GROTARD
            </Link>
          </Typography>
        </Box>
      </footer>
    </Container>
  );
}
