'use server';
import { Box, Button, Card, Typography } from '@mui/material';
import DocumentsTable from './table';
import Link from 'next/link';
import { getDocuments } from '@/services/documents';
import AddIcon from '@mui/icons-material/Add';

export default async function Page() {
  const documents = await getDocuments();

  return (
    <>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            Tous les documents
          </Typography>
          <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
            <Link href="/documents/new">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ marginBottom: '10px' }}
              >
                Importer
              </Button>
            </Link>
          </Box>
        </Box>
        <DocumentsTable documents={documents} />
      </Card>
    </>
  );
}
