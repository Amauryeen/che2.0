'use client';
import { createTheme } from '@mui/material/styles';
import { frFR as dataGridfrFR } from '@mui/x-data-grid/locales';
import { frFR as corefrFR } from '@mui/material/locale';
import { frFR as datePickerfrFR } from '@mui/x-date-pickers/locales';

const theme = createTheme(
  {
    palette: {
      mode: 'dark',
    },
  },
  dataGridfrFR,
  corefrFR,
  datePickerfrFR,
);

export default theme;
