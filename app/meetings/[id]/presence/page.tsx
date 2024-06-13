'use server';

import { getMeetingById } from '@/services/meetings';
import NotFound from '@/components/errors/not-found';
import { auth } from '@/auth';
import { Box, Card, Typography } from '@mui/material';
import Form from './form';

export default async function Page({ params }: { params: { id: string } }) {
  const meetingId = parseInt(params.id);
  const meeting: any = await getMeetingById(meetingId);

  if (
    !meeting ||
    (meeting.status !== 'planned' && meeting.status !== 'started')
  )
    return <NotFound />;

  const session = await auth();
  const attendee = meeting.attendees.find(
    (attendee: any) => attendee.userId === session?.user.id,
  );

  if (!attendee) return <NotFound />;

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Définir ma présence
        </Typography>
      </Box>
      <Typography>
        Veuillez notifier votre présence à la réunion suivante:
      </Typography>
      <Card variant="outlined" sx={{ p: 2, my: 2 }}>
        <Typography variant="h6">{meeting.title}</Typography>
      </Card>
      <Form
        meeting={meeting}
        attendee={attendee}
        attendees={meeting.attendees}
      />
    </Card>
  );
}
