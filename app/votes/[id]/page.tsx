'use server';

import NotFound from '@/components/errors/not-found';
import { getVoteById } from '@/services/votes';
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
import Link from 'next/link';
import { getMeetingById } from '@/services/meetings';

export default async function Page({ params }: { params: { id: string } }) {
  const voteId = parseInt(params.id);
  const vote: any = await getVoteById(voteId);

  if (!vote) return <NotFound />;

  const meeting: any = await getMeetingById(vote.meetingId);

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
                {vote.title}
              </Typography>
              <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                {(() => {
                  switch (vote.status) {
                    case 'started':
                      return (
                        <Chip
                          icon={<ArrowDownwardIcon />}
                          label="Démarré"
                          color="success"
                          variant="outlined"
                        />
                      );
                    case 'planned':
                      return (
                        <Chip
                          icon={<AccessTimeFilledIcon />}
                          label="Planifié"
                          color="warning"
                          variant="outlined"
                        />
                      );
                    case 'ended':
                      return (
                        <Chip
                          icon={<CheckIcon />}
                          label="Terminé"
                          color="info"
                          variant="outlined"
                        />
                      );
                    case 'cancelled':
                      return (
                        <Chip
                          icon={<CloseIcon />}
                          label="Annulé"
                          color="error"
                          variant="outlined"
                        />
                      );
                  }
                })()}
              </Box>
            </Box>
            <Typography variant="body1" gutterBottom>
              {vote.description}
            </Typography>
            <Divider sx={{ my: '10px' }} />
            <Typography variant="body1" gutterBottom>
              <strong>Anonyme:</strong> {vote.anonymous ? 'Oui' : 'Non'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date de création:</strong>{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'full',
                timeStyle: 'short',
              }).format(vote.createdAt)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date de modification:</strong>{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'full',
                timeStyle: 'short',
              }).format(vote.updatedAt)}
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
            <Link href={'/meetings/' + params.id + '/cast'}>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ marginBottom: '10px', width: '100%' }}
              >
                Voter
              </Button>
            </Link>
            <Link href={'/meetings/' + params.id + '/edit'}>
              <Button
                variant="outlined"
                color="primary"
                sx={{ marginBottom: '10px', width: '100%' }}
              >
                Éditer le vote
              </Button>
            </Link>
            <Link href={'/meetings/' + params.id + '/start'}>
              <Button
                variant="outlined"
                color="success"
                sx={{ marginBottom: '10px', width: '100%' }}
                disabled={vote.status !== 'planned'}
              >
                Démarrer le vote
              </Button>
            </Link>
            <Link href={'/votes/' + params.id + '/end'}>
              <Button
                variant="outlined"
                color="warning"
                sx={{ marginBottom: '10px', width: '100%' }}
                disabled={vote.status !== 'started'}
              >
                Mettre fin au vote
              </Button>
            </Link>
            <Link href={'/votes/' + params.id + '/cancel'}>
              <Button
                variant="outlined"
                color="error"
                sx={{ marginBottom: '10px', width: '100%' }}
                disabled={vote.status !== 'planned'}
              >
                Annuler le vote
              </Button>
            </Link>
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
                Participants (
                {vote.votesFor +
                  vote.votesAgainst +
                  vote.votesAbstain +
                  meeting.attendees.filter(
                    (attendee: any) =>
                      !vote.users.some(
                        (user: any) => user.userId === attendee.userId,
                      ),
                  ).length}
                )
              </Typography>
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
                      Pour (
                      {!vote.anonymous || vote.status !== 'started'
                        ? vote.votesFor
                        : '?'}
                      )
                    </Typography>
                  </Box>
                  {vote.users.filter((user: any) => user.value === 'for')
                    .length === 0
                    ? 'Vide.'
                    : vote.users
                        .filter((user: any) => user.value === 'for')
                        .map((user: any) => (
                          <Chip
                            key={user.id}
                            label={
                              user.user.firstName + ' ' + user.user.lastName
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
                      Inconnu/Abstention (
                      {!vote.anonymous || vote.status !== 'started'
                        ? meeting.attendees.filter(
                            (attendee: any) =>
                              !vote.users.some(
                                (user: any) => user.userId === attendee.userId,
                              ),
                          ).length + vote.votesAbstain
                        : '?'}
                      )
                    </Typography>
                  </Box>
                  {vote.users.filter((user: any) => user.value === 'abstain')
                    .length === 0 &&
                  meeting.attendees.filter(
                    (attendee: any) =>
                      !vote.users.some(
                        (user: any) => user.userId === attendee.userId,
                      ),
                  ).length === 0
                    ? 'Vide.'
                    : meeting.attendees
                        .filter(
                          (attendee: any) =>
                            !vote.users.some(
                              (user: any) => user.userId === attendee.userId,
                            ),
                        )
                        .map((user: any) => (
                          <Chip
                            key={user.id}
                            label={
                              user.user.firstName + ' ' + user.user.lastName
                            }
                            color="primary"
                            variant="outlined"
                            sx={{ m: '3px' }}
                          />
                        ))}
                  {vote.users
                    .filter((user: any) => user.value === 'abstain')
                    .map((user: any) => (
                      <Chip
                        key={user.id}
                        label={user.user.firstName + ' ' + user.user.lastName}
                        color="secondary"
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
                      Contre (
                      {!vote.anonymous || vote.status !== 'started'
                        ? vote.votesFor
                        : '?'}
                      )
                    </Typography>
                  </Box>
                  {vote.users.filter((user: any) => user.value === 'against')
                    .length === 0
                    ? 'Vide.'
                    : vote.users
                        .filter((user: any) => user.value === 'against')
                        .map((user: any) => (
                          <Chip
                            key={user.id}
                            label={
                              user.user.firstName + ' ' + user.user.lastName
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
