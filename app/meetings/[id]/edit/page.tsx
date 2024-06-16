'use server';
import { Card, Typography } from '@mui/material';
import Form from './form';
import ProtectedRoute from '@/components/protected-route';
import { getUsers } from '@/services/users';
import { getDocuments } from '@/services/documents';
import { getMeetingById } from '@/services/meetings';
import NotFound from '@/components/errors/not-found';

export default async function Page({ params }: { params: { id: string } }) {
  const meetingId = parseInt(params.id);
  const meeting: any = await getMeetingById(meetingId);

  if (!meeting) return <NotFound />;

  const users = await getUsers();
  const documents = await getDocuments();

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Éditer une réunion
        </Typography>
        <Form users={users} documents={documents} meeting={meeting} />
      </Card>
    </ProtectedRoute>
  );
}
