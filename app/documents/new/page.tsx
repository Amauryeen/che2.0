'use server';
import { Card, Typography } from '@mui/material';
import Form from './form';
import ProtectedRoute from '@/components/protected-route';
import { getRoles } from '@/services/roles';

export default async function Page() {
  const roles = await getRoles();

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Importer un document
        </Typography>
        <Form roles={roles} />
      </Card>
    </ProtectedRoute>
  );
}
