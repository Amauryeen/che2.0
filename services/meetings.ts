'use server';
import prisma from '@/lib/database';
import { MeetingPresence } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getMeetings() {
  return prisma.meeting.findMany({
    orderBy: [{ status: 'asc' }, { startTime: 'desc' }],
  });
}

export async function getMeetingById(id: number) {
  return prisma.meeting.findUnique({
    where: { id },
    include: {
      attendees: {
        include: {
          user: { include: { roles: { include: { role: true } } } },
          procurer: true,
        },
      },
      documents: { include: { document: true } },
    },
  });
}

export async function createMeeting(data: {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  url: string;
  attendees: number[];
  documents: number[];
}) {
  const session = await auth();

  await prisma.meeting.create({
    data: {
      status: 'planned',
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      description: data.description,
      location: data.location || null,
      url: data.url || null,
      creatorId: session?.user.id,
      attendees: {
        create: data.attendees.map(id => ({
          userId: id,
        })),
      },
      documents: {
        create: data.documents.map(id => ({
          documentId: id,
        })),
      },
    },
  });

  revalidatePath('/');
}

export async function startMeeting(id: number) {
  await prisma.meeting.update({
    where: { id, status: 'planned' },
    data: { status: 'started', updatedAt: new Date() },
  });

  revalidatePath('/');
}

export async function endMeeting(id: number) {
  await prisma.meeting.update({
    where: { id, status: 'started' },
    data: { status: 'ended', updatedAt: new Date() },
  });

  await prisma.vote.updateMany({
    where: {
      meetingId: id,
      status: 'started',
    },
    data: { status: 'ended' },
  });

  await prisma.vote.updateMany({
    where: {
      meetingId: id,
      status: 'planned',
    },
    data: { status: 'cancelled' },
  });

  revalidatePath('/');
}

export async function cancelMeeting(id: number) {
  await prisma.meeting.update({
    where: { id, OR: [{ status: 'planned' }, { status: 'started' }] },
    data: { status: 'cancelled', updatedAt: new Date() },
  });

  revalidatePath('/');
}

export async function setMeetingPresence(
  id: number,
  data: {
    presence: MeetingPresence;
    procurer: number | null;
  },
) {
  if (data.presence === 'excused' && data.procurer) {
    const user = await prisma.meetingAttendee.findFirst({
      where: { procurerId: data.procurer },
    });

    if (user) throw Error();
  }

  const meetingAttendee = await prisma.meetingAttendee.update({
    where: { id },
    data: {
      presence: data.presence,
      procurerId: data.presence === 'excused' ? data.procurer : null,
      updatedAt: new Date(),
    },
  });

  if (data.presence !== 'present') {
    await prisma.meetingAttendee.updateMany({
      where: {
        meetingId: meetingAttendee.meetingId,
        procurerId: meetingAttendee.userId,
      },
      data: {
        procurerId: null,
        presence: 'unknown',
      },
    });
  }

  revalidatePath('/');
}

export async function updateMeeting(
  id: number,
  data: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location: string;
    url: string;
    attendees: number[];
    documents: number[];
  },
) {
  const meeting = await prisma.meeting.update({
    where: { id },
    data: {
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      description: data.description,
      location: data.location || null,
      url: data.url || null,
      updatedAt: new Date(),
      documents: {
        deleteMany: {},
        create: data.documents.map(id => ({
          documentId: id,
        })),
      },
    },
    include: { attendees: true, documents: true },
  });

  const currentAttendees = meeting.attendees.map(a => a.userId);
  const newAttendees = data.attendees.filter(
    id => !currentAttendees.includes(id),
  );
  const removedAttendees = currentAttendees.filter(
    id => !data.attendees.includes(id),
  );

  await prisma.meetingAttendee.deleteMany({
    where: {
      meetingId: id,
      userId: { in: removedAttendees },
    },
  });

  await prisma.meetingAttendee.updateMany({
    where: {
      meetingId: id,
      procurerId: { in: removedAttendees },
    },
    data: {
      procurerId: null,
      presence: 'unknown',
    },
  });

  await prisma.meetingAttendee.createMany({
    data: newAttendees.map(userId => ({
      meetingId: id,
      userId,
    })),
  });

  revalidatePath('/');
}
