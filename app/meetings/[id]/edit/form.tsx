'use client';
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import {
  MeetingDocument,
  Meeting,
  MeetingAttendee,
  User,
  Document,
} from '@prisma/client';
import { updateMeeting } from '@/services/meetings';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import fr from 'date-fns/locale/fr';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

export default function Form(props: {
  users: User[];
  documents: Document[];
  meeting: Meeting & {
    attendees: MeetingAttendee[];
    documents: MeetingDocument[];
  };
}) {
  const router = useRouter();
  const schema = yup.object({
    title: yup.string().required('Veuillez renseigner ce champ'),
    description: yup.string().required('Veuillez renseigner ce champ'),
    startTime: yup
      .date()
      .required('Veuillez renseigner ce champ')
      .test(
        'is-before-end',
        'La date de début doit être avant la date de fin',
        function (value) {
          return value < this.parent.endTime;
        },
      ),
    endTime: yup
      .date()
      .required('Veuillez renseigner ce champ')
      .test(
        'is-after-start',
        'La date de fin doit être après la date de début',
        function (value) {
          return value > this.parent.startTime;
        },
      ),
    location: yup.string().optional(),
    url: yup
      .string()
      .optional()
      .test('is-valid-url', 'Veuillez renseigner une URL valide', value => {
        const regex = /^(http|https):\/\/[^ "]+$/;
        return !value || regex.test(value || '');
      }),
    attendees: yup
      .array()
      .of(yup.number().required())
      .required('Veuillez renseigner ce champ')
      .min(1, 'Veuillez renseigner ce champ'),
    documents: yup.array().of(yup.number()),
  });

  const { register, handleSubmit, formState, control } = useForm({
    defaultValues: {
      title: props.meeting.title,
      description: props.meeting.description,
      startTime: props.meeting.startTime,
      endTime: props.meeting.endTime,
      location: props.meeting.location || undefined,
      url: props.meeting.url || undefined,
      attendees: props.meeting.attendees.map(attendee => attendee.userId),
      documents: props.meeting.documents.map(document => document.documentId),
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  function handleSave(formValues: any) {
    if (
      props.meeting.status !== 'planned' &&
      props.meeting.status !== 'started'
    ) {
      formValues.attendees = props.meeting.attendees.map(
        attendee => attendee.userId,
      );
    }

    toast.promise(updateMeeting(props.meeting.id, formValues), {
      loading: 'Modification en cours...',
      success: () => {
        router.push('/meetings');
        return <>La réunion a été mise à jour avec succès.</>;
      },
      error: <>La réunion n&apos;a pas pu être mise à jour.</>,
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
          <Controller
            control={control}
            name="startTime"
            render={({ field: { value, onChange, ...fieldProps } }) => {
              return (
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={fr}
                >
                  <DateTimePicker
                    {...fieldProps}
                    value={value ? new Date(value) : null}
                    onChange={onChange}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    slotProps={{
                      textField: {
                        helperText: errors.startTime?.message,
                        error: !!errors.startTime,
                        label: 'Date de début',
                      },
                    }}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            control={control}
            name="endTime"
            render={({ field: { value, onChange, ...fieldProps } }) => {
              return (
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={fr}
                >
                  <DateTimePicker
                    {...fieldProps}
                    value={value ? new Date(value) : null}
                    onChange={onChange}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    slotProps={{
                      textField: {
                        helperText: errors.endTime?.message,
                        error: !!errors.endTime,
                        label: 'Date de fin',
                      },
                    }}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="text"
            label="Lieu"
            {...register('location')}
            error={!!errors.location}
            helperText={errors.location?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="text"
            label="URL"
            {...register('url')}
            error={!!errors.url}
            helperText={errors.url?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="attendees"
            control={control}
            render={({ field: { onChange, ...fieldProps } }) => (
              <Autocomplete
                disabled={
                  props.meeting.status !== 'planned' &&
                  props.meeting.status !== 'started'
                }
                {...fieldProps}
                multiple
                options={props.users
                  .filter(user => user.status === 'active')
                  .map(user => user.id)}
                getOptionLabel={option =>
                  props.users.find(user => user.id === option)?.firstName +
                  ' ' +
                  props.users.find(user => user.id === option)?.lastName
                }
                isOptionEqualToValue={(option, value) => option === value}
                value={fieldProps.value || []}
                onChange={(_, data) => onChange(data)}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={!!errors.attendees}
                    helperText={errors.attendees?.message}
                    label="Participants"
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="documents"
            control={control}
            render={({ field: { onChange, ...fieldProps } }) => (
              <Autocomplete
                {...fieldProps}
                multiple
                options={props.documents.map(document => document.id)}
                getOptionLabel={option =>
                  props.documents.find(document => document.id === option)
                    ?.title ?? ''
                }
                isOptionEqualToValue={(option, value) => option === value}
                value={fieldProps.value || []}
                onChange={(_, data) => onChange(data)}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={!!errors.documents}
                    helperText={errors.documents?.message}
                    label="Annexes"
                  />
                )}
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
