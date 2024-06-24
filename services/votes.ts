'use server';
import prisma from '@/lib/database';
import { getRoles } from './roles';
import { VoteValue } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getVotes() {
  return prisma.vote.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: { roles: { include: { role: true } }, meeting: true },
  });
}

export async function getVoteById(id: number) {
  return prisma.vote.findUnique({
    where: { id },
    include: {
      roles: { include: { role: true } },
      users: { include: { user: true } },
      meeting: true,
    },
  });
}

export async function createVote(data: {
  title: string;
  description: string;
  roles: string[];
  meeting: number;
  anonymous: boolean;
}) {
  const session = await auth();

  const vote = await prisma.vote.create({
    data: {
      title: data.title,
      description: data.description,
      meetingId: data.meeting,
      anonymous: data.anonymous,
      creatorId: session?.user.id,
    },
  });

  const roles = await getRoles();

  await prisma.voteRole.createMany({
    data: data.roles.map(role => ({
      voteId: vote.id,
      roleId: roles.find(r => r.name === role)?.id ?? 0,
    })),
  });

  revalidatePath('/');
}

export async function startVote(id: number) {
  await prisma.vote.update({
    where: { id, status: 'planned' },
    data: { status: 'started', updatedAt: new Date() },
  });

  revalidatePath('/');
}

export async function endVote(id: number) {
  await prisma.vote.update({
    where: { id, status: 'started' },
    data: { status: 'ended', updatedAt: new Date() },
  });

  revalidatePath('/');
}

export async function cancelVote(id: number) {
  await prisma.vote.update({
    where: { id, OR: [{ status: 'planned' }, { status: 'started' }] },
    data: { status: 'cancelled', updatedAt: new Date() },
  });

  revalidatePath('/');
}

export async function castVote(
  userId: number,
  voteId: number,
  data: { vote: VoteValue; procuration?: VoteValue },
) {
  const vote = await prisma.vote.findUnique({
    where: { id: voteId },
  });

  await prisma.voteUser.create({
    data: {
      voteId,
      userId,
      value: vote?.anonymous ? null : data.vote,
    },
  });

  await prisma.vote.update({
    where: { id: voteId },
    data: {
      votesFor: { increment: data.vote === 'for' ? 1 : 0 },
      votesAgainst: { increment: data.vote === 'against' ? 1 : 0 },
      votesAbstain: { increment: data.vote === 'abstain' ? 1 : 0 },
    },
  });

  if (
    data.procuration === 'for' ||
    data.procuration === 'against' ||
    data.procuration === 'abstain'
  ) {
    const meeting = await prisma.meeting.findUnique({
      where: { id: vote?.meetingId },
      include: { attendees: true },
    });

    const procuration = meeting?.attendees.find(
      (attendee: any) => attendee.procurerId === userId,
    );

    if (!procuration) return;

    await prisma.voteUser.create({
      data: {
        voteId,
        userId: procuration.userId,
        value: vote?.anonymous ? null : data.procuration,
      },
    });

    await prisma.vote.update({
      where: { id: voteId },
      data: {
        votesFor: { increment: data.procuration === 'for' ? 1 : 0 },
        votesAgainst: { increment: data.procuration === 'against' ? 1 : 0 },
        votesAbstain: { increment: data.procuration === 'abstain' ? 1 : 0 },
      },
    });
  }

  revalidatePath('/');
}

export async function updateVote(
  id: number,
  data: {
    title: string;
    description: string;
    roles: string[];
    meeting: number;
    anonymous: boolean;
  },
) {
  await prisma.vote.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      meetingId: data.meeting,
      anonymous: data.anonymous,
    },
  });

  const roles = await getRoles();

  await prisma.voteRole.deleteMany({ where: { voteId: id } });

  await prisma.voteRole.createMany({
    data: data.roles.map(role => ({
      voteId: id,
      roleId: roles.find(r => r.name === role)?.id ?? 0,
    })),
  });

  revalidatePath('/');
}
