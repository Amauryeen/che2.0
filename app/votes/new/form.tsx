'use client';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
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
import { Meeting, Role } from '@prisma/client';
import { createVote } from '@/services/votes';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Form(props: { roles: Role[]; meetings: Meeting[] }) {
  const router = useRouter();
  const schema = yup.object({
    title: yup.string().required('Veuillez renseigner ce champ'),
    description: yup.string().required('Veuillez renseigner ce champ'),
    roles: yup.array().of(yup.string()),
    meeting: yup.number().required('Veuillez renseigner ce champ'),
    anonymous: yup.boolean(),
  });

  const { register, handleSubmit, formState, control } = useForm({
    defaultValues: {
      title: '',
      description: '',
      roles: [],
      meeting: undefined,
      anonymous: false,
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  function handleSave(formValues: any) {
    toast.promise(createVote(formValues), {
      loading: 'Création en cours...',
      success: () => {
        router.push('/votes');
        return <>Le vote a été créé avec succès.</>;
      },
      error: <>Le vote n&apos;a pas pu être créé.</>,
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
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
          <FormControl error={!!errors.meeting} fullWidth>
            <Controller
              control={control}
              name="meeting"
              render={({ field: { value, onChange, ...fieldProps } }) => {
                return (
                  <>
                    <InputLabel id="meeting">Réunion</InputLabel>
                    <Select
                      {...fieldProps}
                      labelId="meeting"
                      value={value}
                      label="Réunion"
                      onChange={e => onChange(e.target.value)}
                      renderValue={selected => (
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          <Chip
                            key={selected}
                            label={
                              props.meetings.find(
                                meeting => meeting.id === selected,
                              )?.title
                            }
                          />
                        </Box>
                      )}
                    >
                      {props.meetings
                        .filter(
                          meeting =>
                            meeting.status === 'planned' ||
                            meeting.status === 'started',
                        )
                        .map(meeting => (
                          <MenuItem key={meeting.id} value={meeting.id}>
                            {meeting.title}
                          </MenuItem>
                        ))}
                    </Select>
                  </>
                );
              }}
            />
            <FormHelperText>{errors.meeting?.message}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox {...register('anonymous')} />}
            label="Le vote est anonyme"
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Planifier
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
