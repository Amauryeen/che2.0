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
import { Role } from '@prisma/client';
import { createDocument } from '@/services/documents';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Form(props: { roles: Role[] }) {
  const router = useRouter();
  const schema = yup.object({
    title: yup.string().required('Veuillez renseigner ce champ'),
    description: yup.string().required('Veuillez renseigner ce champ'),
    roles: yup.array().of(yup.string()).min(1, 'Veuillez renseigner ce champ'),
    file: yup
      .mixed()
      .required('Veuillez renseigner ce champ')
      .test('exists', 'Veuillez renseigner ce champ', (value: any) => {
        return value[0] ? true : false;
      })
      .test(
        'is-correct-size',
        'Le fichier est trop lourd (>4Mo)',
        (value: any) => {
          return value[0] ? value[0].size <= 4194304 : false;
        },
      ),
  });

  const { register, handleSubmit, formState, control } = useForm({
    defaultValues: {
      title: '',
      description: '',
      roles: [],
      file: undefined,
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  async function uploadFile(data: any) {
    const res = await fetch(`/api/documents?name=${data.file[0].name}`, {
      method: 'POST',
      body: data.file[0],
    });

    const body = await res.text();

    await createDocument({
      title: data.title,
      description: data.description,
      name: data.file[0].name,
      type: data.file[0].type,
      roles: data.roles,
      url: body,
    });
  }

  function handleSave(formValues: any) {
    toast.promise(uploadFile(formValues), {
      loading: 'Import en cours...',
      success: () => {
        router.push('/documents');
        return <>Le document a été importé avec succès.</>;
      },
      error: <>Le document n&apos;a pas pu être importé.</>,
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
          <TextField
            type="file"
            {...register('file')}
            error={!!errors.file}
            helperText={errors.file?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Importer
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
