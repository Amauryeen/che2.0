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
import { Meeting, MeetingAttendee, User } from '@prisma/client';
import { setMeetingPresence } from '@/services/meetings';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Form(props: {
  attendee: MeetingAttendee;
  attendees: (MeetingAttendee & { user: User })[];
  meeting: Meeting;
}) {
  const router = useRouter();
  const schema = yup.object({
    presence: yup.string().required('Veuillez renseigner ce champ'),
    procurer: yup
      .number()
      .test(
        'has-procurer',
        'Veuillez sélectionner un participant à qui remettre votre procuration',
        function (value) {
          return this.parent.presence === 'excused' ? !!value : true;
        },
      ),
  });

  const { watch, handleSubmit, formState, control } = useForm({
    defaultValues: {
      presence: props.attendee.presence,
      procurer: props.attendee.procurerId || undefined,
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  function handleSave(formValues: any) {
    toast.promise(setMeetingPresence(props.attendee.id, formValues), {
      loading: 'Définition de la présence en cours...',
      success: () => {
        router.push('/meetings/' + props.meeting.id);
        return <>La présence a été définie avec succès.</>;
      },
      error: <>La présence n&apos;a pas pu être définie.</>,
    });
  }

  const formValues = watch();

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl error={!!errors.presence} fullWidth>
            <Controller
              control={control}
              name="presence"
              render={({ field: { value, onChange, ...fieldProps } }) => {
                return (
                  <>
                    <InputLabel id="presence">Présence</InputLabel>
                    <Select
                      {...fieldProps}
                      labelId="presence"
                      value={value}
                      label="Présence"
                      onChange={e => onChange(e.target.value)}
                      renderValue={selected => (
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          <Chip
                            key={selected}
                            label={
                              selected !== 'present'
                                ? selected === 'unknown'
                                  ? 'Inconnu'
                                  : 'Absent'
                                : 'Présent'
                            }
                          />
                        </Box>
                      )}
                    >
                      <MenuItem key={'present'} value={'present'}>
                        Présent
                      </MenuItem>
                      <MenuItem key={'unknown'} value={'unknown'}>
                        Inconnu
                      </MenuItem>
                      <MenuItem key={'excused'} value={'excused'}>
                        Absent
                      </MenuItem>
                    </Select>
                  </>
                );
              }}
            />
            <FormHelperText>{errors.presence?.message}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={!!errors.procurer} fullWidth>
            <Controller
              control={control}
              name="procurer"
              render={({ field: { value, onChange, ...fieldProps } }) => {
                return (
                  <>
                    <InputLabel
                      id="procurer"
                      disabled={formValues.presence !== 'excused'}
                    >
                      Procureur
                    </InputLabel>
                    <Select
                      {...fieldProps}
                      labelId="procurer"
                      value={value}
                      label="Procureur"
                      onChange={e => onChange(e.target.value)}
                      disabled={formValues.presence !== 'excused'}
                      renderValue={selected => (
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          <Chip
                            key={selected}
                            label={
                              props.attendees.find(
                                attendee => attendee.userId === selected,
                              )?.user.firstName +
                              ' ' +
                              props.attendees.find(
                                attendee => attendee.userId === selected,
                              )?.user.lastName
                            }
                          />
                        </Box>
                      )}
                    >
                      {props.attendees
                        .filter(
                          attendee =>
                            attendee.presence === 'present' &&
                            attendee.userId !== props.attendee.userId &&
                            !props.attendees.some(
                              attendee2 =>
                                attendee.userId === attendee2.procurerId,
                            ),
                        )
                        .map((attendee: any) => (
                          <MenuItem
                            key={attendee.userId}
                            value={attendee.userId}
                          >
                            {attendee.user.firstName +
                              ' ' +
                              attendee.user.lastName}
                          </MenuItem>
                        ))}
                    </Select>
                  </>
                );
              }}
            />
            <FormHelperText>{errors.procurer?.message}</FormHelperText>
          </FormControl>
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
