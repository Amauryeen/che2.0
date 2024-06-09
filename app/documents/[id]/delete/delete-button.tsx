'use client';

import { Button } from '@mui/material';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function DeleteButton(props: { deleteDocument: any }) {
  const router = useRouter();

  return (
    <Button
      variant="contained"
      color="error"
      onClick={() => {
        toast.promise(props.deleteDocument(), {
          loading: 'Suppression en cours...',
          success: () => {
            router.push('/documents');
            return 'Le document a été supprimé.';
          },
          error: "Le document n'a pas pu être supprimé.",
        });
      }}
      sx={{ width: '100%' }}
    >
      Supprimer
    </Button>
  );
}
