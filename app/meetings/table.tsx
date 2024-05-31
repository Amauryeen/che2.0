'use client';
import { DataGrid, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Meeting } from '@prisma/client';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { Chip } from '@mui/material';

export default function Table(props: { meetings: Meeting[] }) {
  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 75, flex: 1 },
    { field: 'title', headerName: 'Titre', minWidth: 150, flex: 1 },
    {
      field: 'startTime',
      headerName: 'Début',
      minWidth: 250,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.row.startTime);
        return new Intl.DateTimeFormat('fr-FR', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(date);
      },
    },
    {
      field: 'endTime',
      headerName: 'Fin',
      minWidth: 250,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.row.endTime);
        return new Intl.DateTimeFormat('fr-FR', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(date);
      },
    },
    {
      field: 'status',
      headerName: 'Statut',
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        switch (params.row.status) {
          case 'started':
            return (
              <Chip
                icon={<ArrowDownwardIcon />}
                label="Démarrée"
                color="success"
                variant="outlined"
              />
            );
          case 'planned':
            return (
              <Chip
                icon={<AccessTimeFilledIcon />}
                label="Planifiée"
                color="warning"
                variant="outlined"
              />
            );
          case 'ended':
            return (
              <Chip
                icon={<CheckIcon />}
                label="Terminée"
                color="info"
                variant="outlined"
              />
            );
          case 'cancelled':
            return (
              <Chip
                icon={<CloseIcon />}
                label="Annulée"
                color="error"
                variant="outlined"
              />
            );
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Link href={`/meetings/${params.row.id}`}>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          </Link>
          <Link href={`/meetings/${params.row.id}/edit`}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
        </>
      ),
    },
  ];

  return (
    <DataGrid
      rows={props.meetings}
      columns={columns}
      slots={{ toolbar: GridToolbar }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
      pageSizeOptions={[5, 10, 20]}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 10 },
        },
        columns: {
          columnVisibilityModel: {
            id: false,
          },
        },
      }}
      disableRowSelectionOnClick
    />
  );
}
