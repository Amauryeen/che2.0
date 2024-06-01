'use server';
import prisma from '@/lib/database';
import { getRoles } from './roles';

export async function getVotes() {
  return prisma.vote.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
    include: { roles: { include: { role: true } }, meeting: true },
  });
}

export async function getVoteById(id: number) {
  return prisma.vote.findUnique({
    where: { id },
    include: { users: { include: { user: true } } },
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
}
