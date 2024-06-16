'use client';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Role, Document } from '@prisma/client';
import { updateDocument } from '@/services/documents';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Form(props: {
  roles: Role[];
  document: Document & { roles: Role[] };
}) {
  const router = useRouter();
  const schema = yup.object({
    title: yup.string().required('Veuillez renseigner ce champ'),
    description: yup.string().required('Veuillez renseigner ce champ'),
    roles: yup.array().of(yup.string()),
    status: yup.string().required('Veuillez renseigner ce champ'),
  });

  const { register, handleSubmit, formState, control } = useForm({
    defaultValues: {
      title: props.document.title,
      description: props.document.description,
      roles: props.document.roles.map((role: any) => role.role.name),
      status: props.document.status,
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  function handleSave(formValues: any) {
    toast.promise(updateDocument(props.document.id, formValues), {
      loading: 'Modification en cours...',
      success: () => {
        router.push('/documents/' + props.document.id);
        return <>Le document a été mis à jour avec succès.</>;
      },
      error: <>Le document n&apos;a pas pu être mis à jour.</>,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            type="text"
            label="Titre"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            type="text"
            label="Description"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
            rows={5}
            multiline
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl error={!!errors.roles} fullWidth>
            <Controller
              control={control}
              name="roles"
              render={({ field: { value, onChange, ...fieldProps } }) => {
                return (
                  <>
                    <InputLabel id="roles">Rôles requis</InputLabel>
                    <Select
                      {...fieldProps}
                      labelId="roles"
                      multiple
                      value={value}
                      label="Rôles requis"
                      onChange={e => onChange(e.target.value as string[])}
                      renderValue={selected => (
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          {(selected as string[]).map(role => (
                            <Chip key={role} label={role} />
                          ))}
                        </Box>
                      )}
                    >
                      {props.roles.map(role => (
                        <MenuItem key={role.id} value={role.name}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                );
              }}
            />
            <FormHelperText>{errors.roles?.message}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl error={!!errors.status} fullWidth>
            <Controller
              control={control}
              name="status"
              render={({ field: { value, onChange, ...fieldProps } }) => {
                return (
                  <>
                    <InputLabel id="status">Statut</InputLabel>
                    <Select
                      {...fieldProps}
                      labelId="status"
                      value={value}
                      label="Statut"
                      onChange={e => onChange(e.target.value)}
                      renderValue={selected => (
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          <Chip
                            key={selected}
                            label={
                              selected === 'effective'
                                ? 'Effectif'
                                : selected === 'archived'
                                  ? 'Archivé'
                                  : 'Épinglé'
                            }
                          />
                        </Box>
                      )}
                    >
                      <MenuItem key={'pinned'} value={'pinned'}>
                        Épinglé
                      </MenuItem>
                      <MenuItem key={'effective'} value={'effective'}>
                        Effectif
                      </MenuItem>
                      <MenuItem key={'archived'} value={'archived'}>
                        Archivé
                      </MenuItem>
                    </Select>
                  </>
                );
              }}
            />
            <FormHelperText>{errors.status?.message}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sauvegarder
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
