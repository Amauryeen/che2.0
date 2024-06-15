'use server';

import NotFound from '@/components/errors/not-found';
import { getDocumentById } from '@/services/documents';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import Link from 'next/link';
import ProtectedRoute from '@/components/protected-route';

export default async function Page({ params }: { params: { id: string } }) {
  const documentId = parseInt(params.id);
  const document: any = await getDocumentById(documentId);

  if (!document) return <NotFound />;

  return (
    <ProtectedRoute
      authorizedRoles={document.roles.map((role: any) => role.role.name)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                {document.title}
              </Typography>
              <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                {(() => {
                  switch (document.status) {
                    case 'pinned':
                      return (
                        <Chip
                          icon={<PushPinIcon />}
                          label="Épinglé"
                          color="info"
                          variant="outlined"
                        />
                      );
                    case 'effective':
                      return (
                        <Chip
                          icon={<CheckIcon />}
                          label="Effectif"
                          color="success"
                          variant="outlined"
                        />
                      );
                    case 'archived':
                      return (
                        <Chip
                          icon={<CloseIcon />}
                          label="Archivé"
                          color="error"
                          variant="outlined"
                        />
                      );
                  }
                })()}
              </Box>
            </Box>
            <Typography variant="body1" gutterBottom>
              {document.description}
            </Typography>
            <Divider sx={{ my: '10px' }} />
            <Typography variant="body1" gutterBottom>
              <strong>Nom du fichier:</strong> {document.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Type du fichier:</strong> {document.type}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date de création:</strong>{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'full',
                timeStyle: 'short',
              }).format(new Date(document.createdAt))}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date de modification:</strong>{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'full',
                timeStyle: 'short',
              }).format(new Date(document.updatedAt))}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Actions
              </Typography>
            </Box>
            <Link href={'/documents/' + params.id + '/edit'}>
              <Button
                variant="outlined"
                color="primary"
                sx={{ marginBottom: '10px', width: '100%' }}
              >
                Éditer le document
              </Button>
            </Link>
            <Link
              href={'/documents/' + params.id + '/download'}
              target="_blank"
            >
              <Button
                variant="outlined"
                color="success"
                sx={{ marginBottom: '10px', width: '100%' }}
              >
                Télécharger le document
              </Button>
            </Link>
            <Link href={'/documents/' + params.id + '/start'}>
              <Button
                variant="outlined"
                color="error"
                sx={{ marginBottom: '10px', width: '100%' }}
              >
                Supprimer le document
              </Button>
            </Link>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Visualisation
              </Typography>
            </Box>
            <iframe
              src={document.url}
              style={{ width: '100%', height: '750px' }}
            />
          </Card>
        </Grid>
      </Grid>
    </ProtectedRoute>
  );
}
