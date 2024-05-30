'use server';

import NotFound from '@/components/errors/not-found';
import { getMeetingById } from '@/services/meetings';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import Link from 'next/link';

export default async function MeetingPage({
  params,
}: {
  params: { id: string };
}) {
  const meetingId = parseInt(params.id);
  const meeting: any = await getMeetingById(meetingId);

  if (!meeting) return <NotFound />;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                {meeting.title}
              </Typography>
              <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                {(() => {
                  switch (meeting.status) {
                    case 'started':
                      return (
                        <Chip
                          icon={<ArrowDownwardIcon />}
                          label="Démarrée"
                          color="success"
                          variant="outlined"
                        />
                      );
                    case 'planned':
                      return (
                        <Chip
                          icon={<AccessTimeFilledIcon />}
                          label="Planifiée"
                          color="warning"
                          variant="outlined"
                        />
                      );
                    case 'ended':
                      return (
                        <Chip
                          icon={<DoneIcon />}
                          label="Terminée"
                          color="info"
                          variant="outlined"
                        />
                      );
                    case 'cancelled':
                      return (
                        <Chip
                          icon={<CloseIcon />}
                          label="Annulée"
                          color="error"
                          variant="outlined"
                        />
                      );
                  }
                })()}
              </Box>
            </Box>
            <Typography variant="body1" gutterBottom>
              {meeting.description}
            </Typography>
            <Divider sx={{ my: '10px' }} />
            <Typography variant="body1" gutterBottom>
              <strong>Début:</strong>{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'full',
                timeStyle: 'short',
              }).format(meeting.startTime)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Fin:</strong>{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'full',
                timeStyle: 'short',
              }).format(meeting.endTime)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Lieu:</strong> {meeting.location}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>URL:</strong>{' '}
              <Link href={meeting.url}>{meeting.url}</Link>
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
            <Link href={'/meetings/' + params.id + '/edit'}>
              <Button
                variant="outlined"
                color="primary"
                sx={{ marginBottom: '10px', width: '100%' }}
              >
                Éditer la réunion
              </Button>
            </Link>
            <Link href={'/meetings/' + params.id + '/start'}>
              <Button
                variant="outlined"
                color="success"
                sx={{ marginBottom: '10px', width: '100%' }}
                disabled={meeting.status !== 'planned'}
              >
                Démarrer la réunion
              </Button>
            </Link>
            <Link href={'/meetings/' + params.id + '/end'}>
              <Button
                variant="outlined"
                color="warning"
                sx={{ marginBottom: '10px', width: '100%' }}
                disabled={meeting.status !== 'started'}
              >
                Mettre fin à la réunion
              </Button>
            </Link>
            <Link href={'/meetings/' + params.id + '/cancel'}>
              <Button
                variant="outlined"
                color="error"
                sx={{ marginBottom: '10px', width: '100%' }}
                disabled={meeting.status !== 'planned'}
              >
                Annuler la réunion
              </Button>
            </Link>
          </Card>
          <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Annexes
              </Typography>
            </Box>
            LOREM IPSUM
          </Card>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Participants
              </Typography>
            </Box>
            LOREM IPSUM
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
