'use client';
import { createTheme } from '@mui/material/styles';
import { frFR } from '@mui/x-data-grid/locales';

const theme = createTheme(
  {
    palette: {
      mode: 'dark',
    },
  },
  frFR,
);

export default theme;
