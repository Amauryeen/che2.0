'use server';
import { Box, Button, Card, Typography } from '@mui/material';
import MeetingsTable from './table';
import Link from 'next/link';
import { getMeetings } from '@/services/meetings';
import AddIcon from '@mui/icons-material/Add';

export default async function Page() {
  const meetings = await getMeetings();

  return (
    <>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            Toutes les réunions
          </Typography>
          <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
            <Link href="/meetings/new">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ marginBottom: '10px' }}
              >
                Créer
              </Button>
            </Link>
          </Box>
        </Box>
        <MeetingsTable meetings={meetings} />
      </Card>
    </>
  );
}
