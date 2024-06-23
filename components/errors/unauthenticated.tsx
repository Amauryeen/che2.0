'use client';

import {
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import {
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
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

  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fpsLimit: 120,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'repulse',
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: '#ffffff',
        },
        links: {
          color: '#ffffff',
          distance: 250,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out,
          },
          random: false,
          speed: 4,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 40,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return (
    <Box
      sx={{
        background:
          'linear-gradient(90deg, hsla(185, 64%, 15%, 1) 0%, hsla(277, 74%, 15%, 1) 100%)',
      }}
    >
      {init && <Particles options={options} />}
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
          border={2}
          borderRadius={4}
          p={2}
          sx={{
            backdropFilter: 'blur(5px)',
          }}
        >
          {error && (
            <Box border={2} borderColor="error.main" borderRadius={4} p={2}>
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
            <Box border={2} borderColor="success.main" borderRadius={5} p={2}>
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
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
          >
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
              color={'info'}
              size="large"
              fullWidth={true}
              sx={{ mt: 5, p: 2, borderRadius: 4 }}
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
                      width={60}
                      height={60}
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
              <Link href="https://github.com/Amauryeen" target={'_blank'}>
                © 2024 Amaury Grotard
              </Link>
            </Typography>
          </Box>
        </footer>
      </Container>
    </Box>
  );
}
