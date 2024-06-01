'use server';
import { Box, Button, Card, Typography } from '@mui/material';
import VotesTable from './table';
import Link from 'next/link';
import { getVotes } from '@/services/votes';
import AddIcon from '@mui/icons-material/Add';

export default async function Page() {
  const votes = await getVotes();

  return (
    <>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            Tous les votes
          </Typography>
          <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
            <Link href="/votes/new">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ marginBottom: '10px' }}
              >
                Planifier
              </Button>
            </Link>
          </Box>
        </Box>
        <VotesTable votes={votes} />
      </Card>
    </>
  );
}
