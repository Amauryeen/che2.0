'use client';
import { Card, Typography } from '@mui/material';
import Form from './form';
import { getRoles } from '@/services/roles';
import { Role } from '@prisma/client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/protected-route';

export default function UsersNewPage() {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    getRoles().then(roles => setRoles(roles));
  }, []);

  return (
    <ProtectedRoute authorizedRoles={['Opérateur']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Créer un utilisateur
        </Typography>
        <Form roles={roles} />
      </Card>
    </ProtectedRoute>
  );
}
