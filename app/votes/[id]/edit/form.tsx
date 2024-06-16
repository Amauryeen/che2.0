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
import { Meeting, Role, Vote } from '@prisma/client';
import { updateVote } from '@/services/votes';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Form(props: {
  roles: Role[];
  meetings: Meeting[];
  vote: Vote & { roles: Role[] };
}) {
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
      title: props.vote.title,
      description: props.vote.description,
      roles: props.vote.roles.map((role: any) => role.role.name),
      meeting: props.vote.meetingId,
      anonymous: props.vote.anonymous,
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  function handleSave(formValues: any) {
    if (props.vote.status !== 'planned') {
      formValues.anonymous = props.vote.anonymous;
      formValues.meeting = props.vote.meetingId;
      formValues.roles = props.vote.roles.map((role: any) => role.role.name);
    }

    toast.promise(updateVote(props.vote.id, formValues), {
      loading: 'Modification en cours...',
      success: () => {
        router.push('/votes/' + props.vote.id);
        return <>Le vote a été modifié avec succès.</>;
      },
      error: <>Le vote n&apos;a pas pu être modifié.</>,
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
                    <InputLabel
                      id="roles"
                      disabled={props.vote.status !== 'planned'}
                    >
                      Rôles requis
                    </InputLabel>
                    <Select
                      {...fieldProps}
                      labelId="roles"
                      multiple
                      value={value}
                      label="Rôles requis"
                      disabled={props.vote.status !== 'planned'}
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
                    <InputLabel
                      id="meeting"
                      disabled={props.vote.status !== 'planned'}
                    >
                      Réunion
                    </InputLabel>
                    <Select
                      {...fieldProps}
                      labelId="meeting"
                      value={value}
                      label="Réunion"
                      disabled={props.vote.status !== 'planned'}
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
          <Controller
            name="anonymous"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                    disabled={props.vote.status !== 'planned'}
                  />
                }
                label="Le vote est anonyme"
              />
            )}
          />
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
