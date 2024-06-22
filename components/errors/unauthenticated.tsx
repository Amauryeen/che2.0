'use client';

import React, { useState } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Unauthenticated(props: any) {
  const [isLoading, setIsLoading] = useState(false);
  const error = useSearchParams().get('error');
  const success = useSearchParams().get('success');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    await props.logIn();
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container
        maxWidth={'sm'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Box
          border={3}
          borderRadius={5}
          p={2}
          sx={{
            backdropFilter: 'blur(10px)',
          }}
        >
          {error && (
            <Box
              border={2}
              borderColor="error.main"
              borderRadius={5}
              p={2}
              mt={1}
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
          {success && (
            <Box
              border={2}
              borderColor="success.main"
              borderRadius={5}
              p={2}
              mt={1}
            >
              <Typography align="center">
                {success === 'sign-out'
                  ? 'Vous avez été déconnecté avec succès.'
                  : 'Action effectuée avec succès.'}
              </Typography>
            </Box>
          )}
          <Box display="flex" justifyContent="center">
            <Image
              src={'/icon.png'}
              alt={'Logo du CHE2'}
              width={200}
              height={200}
            />
          </Box>
          <Typography variant="h3" align="center" gutterBottom>
            CHE2.0
          </Typography>
          <Typography variant="h5" align="center" gutterBottom>
            Plateforme de gestion des tâches numériques du Conseil des Étudiants
            de l&apos;EPHEC
          </Typography>
          <form onSubmit={handleLogin}>
            <Button
              type={'submit'}
              variant={'contained'}
              size="large"
              fullWidth={true}
              sx={{ mt: 5, p: 2 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <Box component="span" mr={1}>
                    Se connecter avec
                  </Box>
                  <Box component="span">
                    <Image
                      src={'/ephec.png'}
                      alt={'EPHEC Logo'}
                      width={50}
                      height={50}
                    />
                  </Box>
                </>
              )}
            </Button>
          </form>
        </Box>
        <footer>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
          >
            <Typography variant="body2" noWrap component="div">
              <Link href="https://github.com/Amauryeen">
                © 2024 Amaury GROTARD
              </Link>
            </Typography>
          </Box>
        </footer>
      </Container>
    </Box>
  );
}
