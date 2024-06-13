'use server';
import prisma from '@/lib/database';
import { getRoles } from './roles';
import { VoteValue } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getVotes() {
  return prisma.vote.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
    include: { roles: { include: { role: true } }, meeting: true },
  });
}

export async function getVoteById(id: number) {
  return prisma.vote.findUnique({
    where: { id },
    include: { roles: true, users: { include: { user: true } } },
  });
}

export async function createVote(data: {
  title: string;
  description: string;
  roles: string[];
  meeting: number;
  anonymous: boolean;
}) {
  const vote = await prisma.vote.create({
    data: {
      title: data.title,
      description: data.description,
      meetingId: data.meeting,
      anonymous: data.anonymous,
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
