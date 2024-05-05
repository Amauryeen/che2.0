'use server';

import prisma from '@/lib/database';

export async function getUsers() {
  return prisma.user.findMany({ include: { roles: true } });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id }, include: { roles: true } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, include: { roles: true } });
}
