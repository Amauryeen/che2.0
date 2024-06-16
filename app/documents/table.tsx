'use client';
import { DataGrid, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Document } from '@prisma/client';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PushPinIcon from '@mui/icons-material/PushPin';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { Chip } from '@mui/material';

export default function Table(props: { documents: Document[] }) {
  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'title', headerName: 'Titre' },
    { field: 'type', headerName: 'Type' },
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
          case 'pinned':
            return (
              <Chip
                icon={<PushPinIcon />}
                label="Épinglé"
                color="info"
                variant="outlined"
              />
            );
          case 'effective':
            return (
              <Chip
                icon={<CheckIcon />}
                label="Effectif"
                color="success"
                variant="outlined"
              />
            );
          case 'archived':
            return (
              <Chip
                icon={<CloseIcon />}
                label="Archivé"
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
          <Link href={`/documents/${params.row.id}`}>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          </Link>
          <Link href={`/documents/${params.row.id}/download`} target="_blank">
            <IconButton>
              <DownloadIcon />
            </IconButton>
          </Link>
          <Link href={`/documents/${params.row.id}/edit`}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
          <Link href={`/documents/${params.row.id}/delete`}>
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
      rows={props.documents}
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
