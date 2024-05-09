'use server';
import { Card, Typography } from '@mui/material';
import Form from './form';
import { getRoles } from '@/services/roles';
import ProtectedRoute from '@/components/protected-route';

export default async function UsersNewPage() {
  const roles = await getRoles();

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Créer un utilisateur
        </Typography>
        <Form roles={roles} />
      </Card>
    </ProtectedRoute>
  );
}
