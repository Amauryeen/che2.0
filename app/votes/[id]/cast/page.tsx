'use server';

import { getVoteById } from '@/services/votes';
import NotFound from '@/components/errors/not-found';
import { auth } from '@/auth';
import { Box, Card, Typography } from '@mui/material';
import Form from './form';
import { getMeetingById } from '@/services/meetings';

export default async function Page({ params }: { params: { id: string } }) {
  const voteId = parseInt(params.id);
  const vote: any = await getVoteById(voteId);

  if (!vote || vote.status !== 'started') return <NotFound />;

  const meeting: any = await getMeetingById(vote.meetingId);

  const session = await auth();
  const attendee = meeting.attendees.find(
    (attendee: any) => attendee.userId === session?.user.id,
  );

  if (
    vote.users.some((user: any) => session?.user.id === user.userId) ||
    attendee.presence !== 'present' ||
    !attendee.user.roles.some(
      (role: any) =>
        !vote.roles.length ||
        vote.roles.some((voteRole: any) => role.roleId === voteRole.roleId),
    )
  )
    return <NotFound />;

  const procuration = meeting.attendees.find(
    (attendee: any) => attendee.procurerId === session?.user.id,
  );

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Voter
        </Typography>
      </Box>
      <Typography>
        Veuillez entrer votre vote pour la décision suivante:
      </Typography>
      <Card variant="outlined" sx={{ p: 2, my: 2 }}>
        <Typography variant="h6">{vote.title}</Typography>
      </Card>
      <Form vote={vote} attendee={attendee} procuration={procuration} />
    </Card>
  );
}
