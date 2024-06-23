'use server';

import { getMeetingById } from '@/services/meetings';
import NotFound from '@/components/errors/not-found';
import { Box, Card, Typography } from '@mui/material';
import Form from './form';
import ProtectedRoute from '@/components/protected-route';

export default async function Page({
  params,
}: {
  params: { id: string; userId: string };
}) {
  const meetingId = parseInt(params.id);
  const meeting: any = await getMeetingById(meetingId);

  if (
    !meeting ||
    (meeting.status !== 'planned' && meeting.status !== 'started')
  )
    return <NotFound />;

  const attendee = meeting.attendees.find(
    (attendee: any) => attendee.userId == params.userId,
  );

  if (!attendee) return <NotFound />;

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            Éditer une présence
          </Typography>
        </Box>
        <Typography>
          Modification de la présence d&apos;un utilisateur à la réunion
          suivante:
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
    </ProtectedRoute>
  );
}
