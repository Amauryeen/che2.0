'use client';

import { Button } from '@mui/material';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ConfirmButton(props: { confirm: any; id: number }) {
  const router = useRouter();

  return (
    <Button
      variant="contained"
      color="success"
      onClick={() => {
        toast.promise(props.confirm(), {
          loading: 'Fin en cours...',
          success: () => {
            router.push('/votes/' + props.id);
            return 'Le vote a été fini avec succès.';
          },
          error: "Le vote n'a pas pu être fini.",
        });
      }}
      sx={{ width: '100%' }}
    >
      Confirmer
    </Button>
  );
}
