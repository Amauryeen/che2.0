'use server';

import { getDocumentById } from '@/services/documents';
import NotFound from '@/components/errors/not-found';
import ProtectedRoute from '@/components/protected-route';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import ConfirmButton from './confirm-button';
import Link from 'next/link';
import { deleteDocument } from '@/services/documents';

export default async function Page({ params }: { params: { id: string } }) {
  const documentId = parseInt(params.id);
  const document: any = await getDocumentById(documentId);

  if (!document) return <NotFound />;

  async function confirm() {
    'use server';
    await deleteDocument(documentId);
  }

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            Supprimer un document
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography>
            Veuillez confirmer la suppression du document suivant:
          </Typography>
          <Card variant="outlined" sx={{ p: 2, my: 2 }}>
            <Typography variant="h6">{document.title}</Typography>
          </Card>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} sm={6}>
              <ConfirmButton confirm={confirm} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Link href={'/documents/' + documentId}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: '100%' }}
                >
                  Revenir en arrière
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </ProtectedRoute>
  );
}
