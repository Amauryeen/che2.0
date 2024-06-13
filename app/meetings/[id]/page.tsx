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
import CheckIcon from '@mui/icons-material/Check';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Link from 'next/link';

export default async function Page({ params }: { params: { id: string } }) {
  const meetingId = parseInt(params.id);
  const meeting: any = await getMeetingById(meetingId);

  if (!meeting) return <NotFound />;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
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
                          icon={<CheckIcon />}
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
              {meeting.url ? (
                <Link href={meeting.url}>{meeting.url}</Link>
              ) : null}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date de création:</strong>{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'full',
                timeStyle: 'short',
              }).format(meeting.createdAt)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date de modification:</strong>{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'full',
                timeStyle: 'short',
              }).format(meeting.updatedAt)}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
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
                disabled={
                  meeting.status !== 'planned' && meeting.status !== 'started'
                }
              >
                Annuler la réunion
              </Button>
            </Link>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Annexes
              </Typography>
            </Box>
            {meeting.documents.length === 0
              ? 'Vide.'
              : meeting.documents.map((document: any) => (
                  <Link
                    key={document.documentId}
                    href={'/documents/' + document.documentId}
                  >
                    <Button
                      variant="outlined"
                      color="info"
                      sx={{ marginBottom: '10px', width: '100%' }}
                    >
                      {document.document.title}
                    </Button>
                  </Link>
                ))}
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
                Participants ({meeting.attendees.length})
              </Typography>
              <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                <Link href={'/meetings/' + params.id + '/presence'}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddTaskIcon />}
                    sx={{ marginBottom: '10px' }}
                    disabled={
                      meeting.status !== 'planned' &&
                      meeting.status !== 'started'
                    }
                  >
                    Ma présence
                  </Button>
                </Link>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography
                      sx={{ fontSize: 20 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Présents (
                      {
                        meeting.attendees.filter(
                          (attendee: any) => attendee.presence === 'present',
                        ).length
                      }
                      )
                    </Typography>
                  </Box>
                  {meeting.attendees.filter(
                    (attendee: any) => attendee.presence === 'present',
                  ).length === 0
                    ? 'Vide.'
                    : meeting.attendees
                        .filter(
                          (attendee: any) => attendee.presence === 'present',
                        )
                        .map((attendee: any) => (
                          <Chip
                            key={attendee.id}
                            label={
                              attendee.user.firstName +
                              ' ' +
                              attendee.user.lastName
                            }
                            color="success"
                            variant="outlined"
                            sx={{ m: '3px' }}
                          />
                        ))}
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography
                      sx={{ fontSize: 20 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Inconnus (
                      {
                        meeting.attendees.filter(
                          (attendee: any) => attendee.presence === 'unknown',
                        ).length
                      }
                      )
                    </Typography>
                  </Box>
                  {meeting.attendees.filter(
                    (attendee: any) => attendee.presence === 'unknown',
                  ).length === 0
                    ? 'Vide.'
                    : meeting.attendees
                        .filter(
                          (attendee: any) => attendee.presence === 'unknown',
                        )
                        .map((attendee: any) => (
                          <Chip
                            key={attendee.id}
                            label={
                              attendee.user.firstName +
                              ' ' +
                              attendee.user.lastName
                            }
                            color="primary"
                            variant="outlined"
                            sx={{ m: '3px' }}
                          />
                        ))}
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography
                      sx={{ fontSize: 20 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Excusés (
                      {
                        meeting.attendees.filter(
                          (attendee: any) => attendee.presence === 'excused',
                        ).length
                      }
                      )
                    </Typography>
                  </Box>
                  {meeting.attendees.filter(
                    (attendee: any) => attendee.presence === 'excused',
                  ).length === 0
                    ? 'Vide.'
                    : meeting.attendees
                        .filter(
                          (attendee: any) => attendee.presence === 'excused',
                        )
                        .map((attendee: any) => (
                          <Chip
                            key={attendee.id}
                            label={
                              attendee.user.firstName +
                              ' ' +
                              attendee.user.lastName
                            }
                            color="error"
                            variant="outlined"
                            sx={{ m: '3px' }}
                          />
                        ))}
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
