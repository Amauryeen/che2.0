import prisma from '../../lib/database';

export default async function main() {
  const meetings = [];

  meetings.push(
    await prisma.meeting.create({
      data: {
        status: 'ended',
        title: 'Assemblée générale',
        startTime: new Date('2021-06-30T18:00:00Z'),
        endTime: new Date('2021-06-30T20:00:00Z'),
        description: 'Assemblée générale mensuelle avec ordre du jour.',
        location: 'EPHEC',
        url: 'https://meet.google.com/abc-def-ghi',
      },
    }),
  );

  return meetings;
}
