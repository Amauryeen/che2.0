'use server';
import { Card, Typography } from '@mui/material';
import Form from './form';
import ProtectedRoute from '@/components/protected-route';
import { getRoles } from '@/services/roles';
import { getDocumentById } from '@/services/documents';
import NotFound from '@/components/errors/not-found';

export default async function Page({ params }: { params: { id: string } }) {
  const documentId = parseInt(params.id);
  const document: any = await getDocumentById(documentId);

  if (!document) return <NotFound />;

  const roles = await getRoles();

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Éditer un document
        </Typography>
        <Form roles={roles} document={document} />
      </Card>
    </ProtectedRoute>
  );
}
