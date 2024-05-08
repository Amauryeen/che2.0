'use client';
import { Card, Typography } from '@mui/material';
import Form from './form';
import { getRoles } from '@/services/roles';
import { Role } from '@prisma/client';
import { useEffect, useState } from 'react';
import checkCurrentUserRoles from '@/lib/checkCurrentUserRoles';
import Unauthorized from '@/components/errors/unauthorized';

export default function UsersNewPage() {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    checkCurrentUserRoles(['Opérateur']).then(response => {
      if (!response) return;
      getRoles().then(roles => setRoles(roles));
    });
  }, []);
  return (
    <>
      {roles.length === 0 ? (
        <Unauthorized />
      ) : (
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            Créer un utilisateur
          </Typography>
          <Form roles={roles} />
        </Card>
      )}
    </>
  );
}
