'use server';
import { auth } from '@/auth';
import prisma from '@/lib/database';
import { getRoles } from '@/services/roles';
import { UserStatus } from '@prisma/client';

export async function getUsers() {
  return prisma.user.findMany({
    include: { roles: { include: { role: true } } },
    orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: { roles: { include: { role: true } } },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } } },
  });
}

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.email) throw Error('No user session found');

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email },
    include: { roles: { include: { role: true } } },
  });

  if (!user) throw Error('User not found');

  return user;
}

export async function createUser(data: {
  status: UserStatus;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}) {
  const user = await prisma.user.create({
    data: {
      status: data.status,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });

  const roles = await getRoles();

  await prisma.userRole.createMany({
    data: data.roles.map(role => ({
      userId: user.id,
      roleId: roles.find(r => r.name === role)?.id ?? 0,
    })),
  });
}

export async function updateUser(
  id: number,
  data: {
    status: UserStatus;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  },
) {
  await prisma.user.update({
    where: { id },
    data: {
      status: data.status,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });

  const roles = await getRoles();

  await prisma.userRole.deleteMany({ where: { userId: id } });

  await prisma.userRole.createMany({
    data: data.roles.map(role => ({
      userId: id,
      roleId: roles.find(r => r.name === role)?.id ?? 0,
    })),
  });
}
