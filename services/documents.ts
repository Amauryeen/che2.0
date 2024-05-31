'use server';
import prisma from '@/lib/database';
import { getRoles } from './roles';

export async function getDocuments() {
  return prisma.document.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
    include: { roles: { include: { role: true } } },
  });
}

export async function getDocumentById(id: number) {
  return prisma.document.findUnique({
    where: { id },
    include: { roles: { include: { role: true } } },
  });
}

export async function createDocument(data: {
  title: string;
  description: string;
  name: string;
  type: string;
  roles: string[];
  url: string;
}) {
  const document = await prisma.document.create({
    data: {
      title: data.title,
      description: data.description,
      name: data.name,
      type: data.type,
      url: data.url,
      status: 'effective',
    },
  });

  const roles = await getRoles();

  await prisma.documentRole.createMany({
    data: data.roles.map(role => ({
      documentId: document.id,
      roleId: roles.find(r => r.name === role)?.id ?? 0,
    })),
  });
}
