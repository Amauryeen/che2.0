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
import { Role, User } from '@prisma/client';
import { updateUser } from '@/services/users';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Form(props: {
  roles: Role[];
  users: User[];
  user: User & { roles: Role[] };
}) {
  const router = useRouter();
  const schema = yup.object({
    status: yup.string(),
    firstName: yup.string().required('Veuillez renseigner ce champ'),
    lastName: yup.string().required('Veuillez renseigner ce champ'),
    email: yup
      .string()
      .email('Veuillez renseigner un e-mail valide')
      .required('Veuillez renseigner ce champ')
      .test(
        'is-ephec-email',
        'Veuillez renseigner un e-mail @students.ephec.be ou @ephec.be',
        value => {
          return (
            value?.endsWith('@students.ephec.be') ||
            value?.endsWith('@ephec.be')
          );
        },
      )
      .test(
        'is-unique-email',
        'Un compte avec cet e-mail existe déjà',
        value => {
          return !props.users.some(
            user => user.email === value && user.email !== props.user.email,
          );
        },
      )
      .test(
        'is-valid-format',
        "Veuillez ne pas utiliser l'e-mail matricule mais plutôt l'email prénom-nom",
        value => {
          const regex = /^(HE\d+|G\d+)/i;
          return !regex.test(value || '');
        },
      ),
    roles: yup.array().of(yup.string()).min(1, 'Veuillez renseigner ce champ'),
  });

  const { register, handleSubmit, formState, control } = useForm({
    defaultValues: {
      status: props.user.status,
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      email: props.user.email,
      roles: props.user.roles.map((role: any) => role.role.name),
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  function handleSave(formValues: any) {
    formValues.lastName = formValues.lastName.toUpperCase();
    formValues.email = formValues.email.toLowerCase();
    formValues.firstName = formValues.firstName
      .split(' ')
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(' ');

    toast.promise(updateUser(props.user.id, formValues), {
      loading: 'Modification en cours...',
      success: () => {
        router.push('/users/' + props.user.id);
        return <>L&apos;utilisateur a été mis à jour avec succès.</>;
      },
      error: <>L&apos;utilisateur n&apos;a pas pu être mis à jour.</>,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            type="text"
            label="Prénom"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="text"
            label="Nom"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            type="email"
            label="E-mail"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
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
                    <InputLabel id="roles">Rôles</InputLabel>
                    <Select
                      {...fieldProps}
                      labelId="roles"
                      multiple
                      value={value}
                      label="Rôles"
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
                            label={selected === 'active' ? 'Actif' : 'Inactif'}
                          />
                        </Box>
                      )}
                    >
                      <MenuItem key={'active'} value={'active'}>
                        Actif
                      </MenuItem>
                      <MenuItem key={'inactive'} value={'inactive'}>
                        Inactif
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
