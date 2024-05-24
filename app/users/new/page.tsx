'use server';
import { Card, Typography } from '@mui/material';
import Form from './form';
import { getRoles } from '@/services/roles';
import ProtectedRoute from '@/components/protected-route';
import { getUsers } from '@/services/users';

export default async function UsersNewPage() {
  const roles = await getRoles();
  const users = await getUsers();

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Créer un utilisateur
        </Typography>
        <Form roles={roles} users={users} />
      </Card>
    </ProtectedRoute>
  );
}
