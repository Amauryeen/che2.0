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
          loading: 'Annulation en cours...',
          success: () => {
            router.push('/meetings/' + props.id);
            return 'La réunion a été annulée avec succès.';
          },
          error: "La réunion n'a pas pu être annulée.",
        });
      }}
      sx={{ width: '100%' }}
    >
      Confirmer
    </Button>
  );
}
