'use server';
import prisma from '@/lib/database';
import { MeetingPresence } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getMeetings() {
  return prisma.meeting.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function getMeetingById(id: number) {
  return prisma.meeting.findUnique({
    where: { id },
    include: {
      attendees: {
        include: { user: { include: { roles: { include: { role: true } } } } },
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
  await prisma.meeting.create({
    data: {
      status: 'planned',
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      description: data.description,
      location: data.location || null,
      url: data.url || null,
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
  await prisma.meetingAttendee.update({
    where: { id },
    data: {
      presence: data.presence,
      procurerId: data.presence === 'excused' ? data.procurer : null,
      updatedAt: new Date(),
    },
  });

  revalidatePath('/');
}
