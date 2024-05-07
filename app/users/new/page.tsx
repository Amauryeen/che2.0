'use client';
import Unauthorized from '@/components/errors/unauthorized';
import checkCurrentUserRoles from '@/lib/checkCurrentUserRoles';
import { Card, Typography } from '@mui/material';
import Form from './form';
import { getRoles } from '@/services/roles';
import { Role } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function UsersNewPage() {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    checkCurrentUserRoles(['Opérateur']).then((response: boolean) => {
      if (!response) return <Unauthorized />;
    });

    getRoles().then(response => setRoles(response));
  }, []);

  return (
    <>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Créer un utilisateur
        </Typography>
        <Form roles={roles} />
      </Card>
    </>
  );
}
