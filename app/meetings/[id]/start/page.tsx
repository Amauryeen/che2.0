'use server';

import NotFound from '@/components/errors/not-found';
import ProtectedRoute from '@/components/protected-route';
import { getMeetingById } from '@/services/meetings';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import Link from 'next/link';

export default async function MeetingPage({
  params,
}: {
  params: { id: string };
}) {
  const meetingId = parseInt(params.id);
  const meeting: any = await getMeetingById(meetingId);

  if (!meeting || meeting.status !== 'planned') return <NotFound />;

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            Démarrer une réunion
          </Typography>
        </Box>
        <Typography variant="body1" gutterBottom>
          Vous êtes sur le point de démarrer la réunion &quot;{meeting.title}
          &quot; du{' '}
          {new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'full',
            timeStyle: 'short',
          }).format(meeting.startTime)}
          .
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" color="success" sx={{ width: '100%' }}>
              Démarrer la réunion
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Link href={`/meetings/${meetingId}`}>
              <Button variant="outlined" color="error" sx={{ width: '100%' }}>
                Revenir en arrière
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Card>
    </ProtectedRoute>
  );
}
