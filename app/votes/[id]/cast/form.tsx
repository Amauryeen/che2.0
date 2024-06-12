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
} from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { MeetingAttendee, User, Vote } from '@prisma/client';
import { castVote } from '@/services/votes';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Form(props: {
  attendee: MeetingAttendee;
  vote: Vote;
  procuration: MeetingAttendee & { user: User };
}) {
  const router = useRouter();
  const schema = yup.object({
    vote: yup.string().required('Veuillez renseigner ce champ'),
    procuration: yup
      .string()
      .test('is-procurer', 'Veuillez renseigner ce champ', function (value) {
        return props.procuration ? !!value : true;
      }),
  });

  const { handleSubmit, formState, control } = useForm({
    defaultValues: {
      vote: '',
      procuration: '',
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  function handleSave(formValues: any) {
    toast.promise(castVote(props.attendee.userId, props.vote.id, formValues), {
      loading: 'Vote en cours...',
      success: () => {
        router.push('/votes/' + props.vote.id);
        return <>Le vote a été envoyé avec succès.</>;
      },
      error: <>Le vote n&apos;a pas pu être envoyé.</>,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <FormControl error={!!errors.vote} fullWidth>
            <Controller
              control={control}
              name="vote"
              render={({ field: { value, onChange, ...fieldProps } }) => {
                return (
                  <>
                    <InputLabel id="presence">Mon vote</InputLabel>
                    <Select
                      {...fieldProps}
                      labelId="vote"
                      value={value}
                      label="Mon vote"
                      onChange={e => onChange(e.target.value)}
                      renderValue={selected => (
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          <Chip
                            key={selected}
                            label={
                              selected !== 'for'
                                ? selected === 'abstain'
                                  ? 'Abstention'
                                  : 'Contre'
                                : 'Pour'
                            }
                          />
                        </Box>
                      )}
                    >
                      <MenuItem key={'for'} value={'for'}>
                        Pour
                      </MenuItem>
                      <MenuItem key={'abstain'} value={'abstain'}>
                        Abstention
                      </MenuItem>
                      <MenuItem key={'against'} value={'against'}>
                        Contre
                      </MenuItem>
                    </Select>
                  </>
                );
              }}
            />
            <FormHelperText>{errors.vote?.message}</FormHelperText>
          </FormControl>
        </Grid>
        {props.procuration && (
          <>
            <Grid item xs={12} sm={12}>
              <FormControl error={!!errors.procuration} fullWidth>
                <Controller
                  control={control}
                  name="procuration"
                  render={({ field: { value, onChange, ...fieldProps } }) => {
                    return (
                      <>
                        <InputLabel id="procuration">
                          Procuration de {props.procuration.user.firstName}{' '}
                          {props.procuration.user.lastName}
                        </InputLabel>
                        <Select
                          {...fieldProps}
                          labelId="procuration"
                          value={value}
                          label={
                            'Procuration de ' +
                            props.procuration.user.firstName +
                            ' ' +
                            props.procuration.user.lastName
                          }
                          onChange={e => onChange(e.target.value)}
                          renderValue={selected => (
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5,
                              }}
                            >
                              <Chip
                                key={selected}
                                label={
                                  selected !== 'for'
                                    ? selected === 'abstain'
                                      ? 'Abstention'
                                      : 'Contre'
                                    : 'Pour'
                                }
                              />
                            </Box>
                          )}
                        >
                          <MenuItem key={'for'} value={'for'}>
                            Pour
                          </MenuItem>
                          <MenuItem key={'abstain'} value={'abstain'}>
                            Abstention
                          </MenuItem>
                          <MenuItem key={'against'} value={'against'}>
                            Contre
                          </MenuItem>
                        </Select>
                      </>
                    );
                  }}
                />
                <FormHelperText>{errors.procuration?.message}</FormHelperText>
              </FormControl>
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Soumettre
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
