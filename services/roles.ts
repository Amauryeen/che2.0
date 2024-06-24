'use server';
import prisma from '@/lib/database';

export async function getRoles() {
  return prisma.role.findMany({
    orderBy: [{ createdAt: 'desc' }],
  });
}
