'use client';
import { DataGrid, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Vote } from '@prisma/client';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { Chip } from '@mui/material';

export default function Table(props: { votes: Vote[] }) {
  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'title', headerName: 'Titre' },
    {
      field: 'meeting',
      headerName: 'Réunion',
      renderCell: (params: GridRenderCellParams) => params.row.meeting.title,
    },
    {
      field: 'roles',
      headerName: 'Rôles requis',
      renderCell: (params: GridRenderCellParams) => {
        return params.row.roles.map((role: any) => (
          <Chip
            key={role.role.name}
            label={role.role.name}
            sx={{ mr: '5px' }}
            variant="outlined"
          />
        ));
      },
    },
    {
      field: 'status',
      headerName: 'Statut',
      renderCell: (params: GridRenderCellParams) => {
        switch (params.row.status) {
          case 'started':
            return (
              <Chip
                icon={<ArrowDownwardIcon />}
                label="Démarré"
                color="success"
                variant="outlined"
              />
            );
          case 'planned':
            return (
              <Chip
                icon={<AccessTimeFilledIcon />}
                label="Planifié"
                color="warning"
                variant="outlined"
              />
            );
          case 'ended':
            return (
              <Chip
                icon={<CheckIcon />}
                label="Terminé"
                color="info"
                variant="outlined"
              />
            );
          case 'cancelled':
            return (
              <Chip
                icon={<CloseIcon />}
                label="Annulé"
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
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Link href={`/votes/${params.row.id}`}>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          </Link>
          <Link href={`/votes/${params.row.id}/edit`}>
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
      rows={props.votes}
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
      autosizeOnMount={true}
      autosizeOptions={{
        includeHeaders: true,
        includeOutliers: true,
        outliersFactor: 1.5,
        expand: true,
      }}
    />
  );
}
