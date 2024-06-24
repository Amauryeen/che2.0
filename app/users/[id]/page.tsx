'use server';

import NotFound from '@/components/errors/not-found';
import { Box, Button, Card, Chip, Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import Link from 'next/link';
import { getUserById } from '@/services/users';

export default async function Page({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id);
  const user: any = await getUserById(userId);

  if (!user) return <NotFound />;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                {(() => {
                  switch (user.status) {
                    case 'active':
                      return (
                        <Chip
                          icon={<CheckIcon />}
                          label="Actif"
                          color="success"
                          variant="outlined"
                        />
                      );
                    case 'inactive':
                      return (
                        <Chip
                          icon={<CloseIcon />}
                          label="Inactif"
                          color="error"
                          variant="outlined"
                        />
                      );
                  }
                })()}
              </Box>
            </Box>
            <Typography variant="body1" gutterBottom>
              <strong>E-mail:</strong> {user.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Dernière connexion:</strong>{' '}
              {user.lastLogin
                ? new Intl.DateTimeFormat('fr-FR', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                    timeZone: 'Europe/Brussels',
                  }).format(new Date(user.lastLogin))
                : 'Jamais'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date de création:</strong>{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'full',
                timeStyle: 'short',
                timeZone: 'Europe/Brussels',
              }).format(new Date(user.createdAt))}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date de modification:</strong>{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'full',
                timeStyle: 'short',
                timeZone: 'Europe/Brussels',
              }).format(new Date(user.updatedAt))}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Actions
              </Typography>
            </Box>
            <Link href={'/users/' + params.id + '/edit'}>
              <Button
                variant="outlined"
                color="primary"
                sx={{ marginBottom: '10px', width: '100%' }}
              >
                Éditer l&apos;utilisateur
              </Button>
            </Link>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
