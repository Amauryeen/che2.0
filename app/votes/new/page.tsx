'use server';
import { Card, Typography } from '@mui/material';
import Form from './form';
import ProtectedRoute from '@/components/protected-route';
import { getRoles } from '@/services/roles';
import { getMeetings } from '@/services/meetings';

export default async function Page() {
  const roles = await getRoles();
  const meetings = await getMeetings();

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Planifier un vote
        </Typography>
        <Form roles={roles} meetings={meetings} />
      </Card>
    </ProtectedRoute>
  );
}
