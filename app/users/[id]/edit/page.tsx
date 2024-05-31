'use server';
import { Card, Typography } from '@mui/material';
import Form from './form';
import { getRoles } from '@/services/roles';
import ProtectedRoute from '@/components/protected-route';
import { getUserById, getUsers } from '@/services/users';
import NotFound from '@/components/errors/not-found';

export default async function Page({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id);
  const user: any = await getUserById(userId);

  if (!user) return <NotFound />;

  const roles = await getRoles();
  const users = await getUsers();

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Éditer un utilisateur
        </Typography>
        <Form roles={roles} users={users} user={user} />
      </Card>
    </ProtectedRoute>
  );
}
