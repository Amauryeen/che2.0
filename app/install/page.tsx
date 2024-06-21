'use server';

import { Box, Card, Typography } from '@mui/material';
import Image from 'next/image';

export default async function Page() {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Installer l&apos;application
        </Typography>
      </Box>
      Il est possible d&apos;installer CHE2.0 directement sur votre ordinateur
      (et votre téléphone portable). Pour le faire sur ordinateur, munissez-vous
      d&apos;un navigateur Chromium (Google Chrome, Microsoft Edge, Brave, etc.
      Safari ne fonctionne pas!) et suivez les étapes suivantes :
      <ol>
        <li>
          - Cliquez sur le bouton d&apos;installation dans votre barre de
          recherche
        </li>
        <li>- Cliquez sur &quot;Installer&quot;</li>
      </ol>
      <br />
      Voici un exemple de ce que vous devriez voir :
      <br />
      <br />
      <Image
        src={'/install_chromium.png'}
        alt={'Installer sur Chromium'}
        width={2000}
        height={2000}
      />
    </Card>
  );
}
