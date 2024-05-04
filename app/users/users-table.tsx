'use client';
import { DataGrid, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { User, UserRole } from '@prisma/client';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { Chip } from '@mui/material';

export default function UsersTable(props: { users: User[] }) {
  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 75, flex: 1 },
    {
      field: 'isActive',
      headerName: 'Statut',
      minWidth: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        params.row.isActive ? (
          <Chip icon={<CheckIcon />} label="Actif" color="success" />
        ) : (
          <Chip icon={<CloseIcon />} label="Inactif" color="error" />
        ),
    },
    {
      field: 'roles',
      headerName: 'Rôles',
      minWidth: 400,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const roleLabels = {
          OPERATOR: 'Opérateur',
          ADMINISTRATOR: 'Administrateur',
          MEMBER_FULL: 'Membre Effectif',
          MEMBER: 'Membre Adhérant',
          GUEST: 'Invité',
        };
        return params.row.roles.map((role: UserRole) => (
          <Chip
            key={role.userId}
            label={roleLabels[role.role]}
            sx={{ mr: '5px' }}
          />
        ));
      },
    },
    { field: 'email', headerName: 'E-mail', minWidth: 300, flex: 1 },
    { field: 'lastName', headerName: 'Nom', minWidth: 200, flex: 1 },
    { field: 'firstName', headerName: 'Prénom', minWidth: 200, flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 150,
      flex: 1,
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
          <Link href={`/users/${params.row.id}/delete`}>
            <IconButton>
              <DeleteIcon />
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
        columns: {
          columnVisibilityModel: {
            id: false,
            email: false,
          },
        },
        pagination: {
          paginationModel: { page: 0, pageSize: 10 },
        },
      }}
    />
  );
}
