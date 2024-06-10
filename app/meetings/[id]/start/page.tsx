'use server';

import { getMeetingById } from '@/services/meetings';
import NotFound from '@/components/errors/not-found';
import ProtectedRoute from '@/components/protected-route';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import ConfirmButton from './confirm-button';
import Link from 'next/link';
import { startMeeting } from '@/services/meetings';

export default async function Page({ params }: { params: { id: string } }) {
  const meetingId = parseInt(params.id);
  const meeting: any = await getMeetingById(meetingId);

  if (!meeting || meeting.status !== 'planned') return <NotFound />;

  async function confirm() {
    'use server';
    await startMeeting(meetingId);
  }

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            Démarrer une réunion
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography>
            Veuillez confirmer le démarrage de la réunion suivante:
          </Typography>
          <Card variant="outlined" sx={{ p: 2, my: 2 }}>
            <Typography variant="h6">{meeting.title}</Typography>
          </Card>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} sm={6}>
              <ConfirmButton confirm={confirm} id={meetingId} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Link href={'/meetings/' + meetingId}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: '100%' }}
                >
                  Revenir en arrière
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </ProtectedRoute>
  );
}
