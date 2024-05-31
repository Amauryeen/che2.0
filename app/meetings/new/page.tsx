'use server';
import { Card, Typography } from '@mui/material';
import Form from './form';
import ProtectedRoute from '@/components/protected-route';
import { getUsers } from '@/services/users';
import { getDocuments } from '@/services/documents';

export default async function Page() {
  const users = await getUsers();
  const documents = await getDocuments();

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Créer une réunion
        </Typography>
        <Form users={users} documents={documents} />
      </Card>
    </ProtectedRoute>
  );
}
