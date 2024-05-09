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
import { Role } from '@prisma/client';
import { createUser } from '@/services/users';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const schema = yup.object({
  status: yup.boolean(),
  firstName: yup.string().required('Veuillez renseigner ce champ'),
  lastName: yup.string().required('Veuillez renseigner ce champ'),
  email: yup
    .string()
    .email('Veuillez renseigner un email valide')
    .required('Veuillez renseigner ce champ')
    .test(
      'is-ephec-email',
      'Veuillez renseigner un email @students.ephec.be ou @ephec.be',
      value => {
        return (
          value?.endsWith('@students.ephec.be') || value?.endsWith('@ephec.be')
        );
      },
    ),
  roles: yup.array().of(yup.string()).min(1, 'Veuillez renseigner ce champ'),
});

export default function Form(props: { roles: Role[] }) {
  const { register, handleSubmit, formState, control } = useForm({
    defaultValues: {
      status: true,
      firstName: '',
      lastName: '',
      email: '',
      roles: [],
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  function handleSave(formValues: any) {
    if (formValues.status) {
      formValues.status = 'active';
    } else {
      formValues.status = 'inactive';
    }
    createUser(formValues)
      .then(() => {
        router.push('/users');
        toast.success("L'utilisateur a été créé avec succès.");
      })
      .catch(reason => {
        toast.error(reason.message);
      });
  }

  const router = useRouter();

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
            label="Email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
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
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Activer le compte automatiquement dès la création"
            {...register('status')}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Soumettre
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
