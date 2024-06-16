'use server';
import { Card, Typography } from '@mui/material';
import Form from './form';
import ProtectedRoute from '@/components/protected-route';
import { getRoles } from '@/services/roles';
import { getMeetings } from '@/services/meetings';
import { getVoteById } from '@/services/votes';
import NotFound from '@/components/errors/not-found';

export default async function Page({ params }: { params: { id: string } }) {
  const voteId = parseInt(params.id);
  const vote: any = await getVoteById(voteId);

  if (!vote) return <NotFound />;

  const roles = await getRoles();
  const meetings = await getMeetings();

  return (
    <ProtectedRoute authorizedRoles={['Gestionnaire']}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Éditer un vote
        </Typography>
        <Form roles={roles} meetings={meetings} vote={vote} />
      </Card>
    </ProtectedRoute>
  );
}
