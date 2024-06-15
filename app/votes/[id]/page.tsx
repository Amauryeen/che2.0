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
import HowToVoteIcon from '@mui/icons-material/HowToVote';
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
                timeZone: 'Europe/Brussels',
              }).format(new Date(vote.createdAt))}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date de modification:</strong>{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'full',
                timeStyle: 'short',
                timeZone: 'Europe/Brussels',
              }).format(new Date(vote.updatedAt))}
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
            <Link href={'/votes/' + params.id + '/edit'}>
              <Button
                variant="outlined"
                color="primary"
                sx={{ marginBottom: '10px', width: '100%' }}
              >
                Éditer le vote
              </Button>
            </Link>
            <Link href={'/votes/' + params.id + '/start'}>
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
                disabled={
                  vote.status !== 'planned' && vote.status !== 'started'
                }
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
                      ) &&
                      (attendee.presence === 'present' ||
                        attendee.presence === 'excused') &&
                      attendee.user.roles.some(
                        (role: any) =>
                          !vote.roles.length ||
                          vote.roles.some(
                            (voteRole: any) => role.roleId === voteRole.roleId,
                          ),
                      ),
                  ).length}
                )
              </Typography>
              <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                <Link href={'/votes/' + params.id + '/cast'}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<HowToVoteIcon />}
                    sx={{ marginBottom: '10px' }}
                    disabled={vote.status !== 'started'}
                  >
                    Voter
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
                      Inconnus/Abstentions (
                      {!vote.anonymous || vote.status !== 'started'
                        ? meeting.attendees.filter(
                            (attendee: any) =>
                              !vote.users.some(
                                (user: any) => user.userId === attendee.userId,
                              ) &&
                              (attendee.presence === 'present' ||
                                attendee.presence === 'excused') &&
                              attendee.user.roles.some(
                                (role: any) =>
                                  !vote.roles.length ||
                                  vote.roles.some(
                                    (voteRole: any) =>
                                      role.roleId === voteRole.roleId,
                                  ),
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
                      ) &&
                      (attendee.presence === 'present' ||
                        attendee.presence === 'excused') &&
                      attendee.user.roles.some(
                        (role: any) =>
                          !vote.roles.length ||
                          vote.roles.some(
                            (voteRole: any) => role.roleId === voteRole.roleId,
                          ),
                      ),
                  ).length === 0
                    ? 'Vide.'
                    : meeting.attendees
                        .filter(
                          (attendee: any) =>
                            !vote.users.some(
                              (user: any) => user.userId === attendee.userId,
                            ) &&
                            (attendee.presence === 'present' ||
                              attendee.presence === 'excused') &&
                            attendee.user.roles.some(
                              (role: any) =>
                                !vote.roles.length ||
                                vote.roles.some(
                                  (voteRole: any) =>
                                    role.roleId === voteRole.roleId,
                                ),
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
                        ? vote.votesAgainst
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
