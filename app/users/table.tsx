'use client';
import { DataGrid, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { User } from '@prisma/client';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { Chip } from '@mui/material';

export default function Table(props: { users: User[] }) {
  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'lastName', headerName: 'Nom' },
    { field: 'firstName', headerName: 'Prénom' },
    { field: 'email', headerName: 'E-mail' },
    {
      field: 'roles',
      headerName: 'Rôles',
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
      renderCell: (params: GridRenderCellParams) =>
        params.row.status === 'active' ? (
          <Chip
            icon={<CheckIcon />}
            label="Actif"
            color="success"
            variant="outlined"
          />
        ) : (
          <Chip
            icon={<CloseIcon />}
            label="Inactif"
            color="error"
            variant="outlined"
          />
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Link href={`/users/${params.row.id}`}>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          </Link>
          <Link href={`/users/${params.row.id}/edit`}>
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
      rows={props.users}
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
