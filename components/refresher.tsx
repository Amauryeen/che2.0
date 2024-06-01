'use client';

import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';

export default function Refresher() {
  const router = useRouter();
  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<RefreshIcon />}
      sx={{ marginBottom: '10px' }}
      onClick={() => router.refresh()}
    >
      Rafraîchir
    </Button>
  );
}
