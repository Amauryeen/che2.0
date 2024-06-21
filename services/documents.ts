'use server';
import prisma from '@/lib/database';
import { getRoles } from './roles';
import { revalidatePath } from 'next/cache';
import { DocumentStatus } from '@prisma/client';
import { auth } from '@/auth';

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
  const session = await auth();

  const document = await prisma.document.create({
    data: {
      title: data.title,
      description: data.description,
      name: data.name,
      type: data.type,
      url: data.url,
      status: 'effective',
      creatorId: session?.user.id,
    },
  });

  const roles = await getRoles();

  await prisma.documentRole.createMany({
    data: data.roles.map(role => ({
      documentId: document.id,
      roleId: roles.find(r => r.name === role)?.id ?? 0,
    })),
  });

  revalidatePath('/');
}

export async function deleteDocument(id: number) {
  await prisma.documentRole.deleteMany({ where: { documentId: id } });
  await prisma.meetingDocument.deleteMany({ where: { documentId: id } });
  await prisma.document.delete({ where: { id } });

  revalidatePath('/');
}

export async function updateDocument(
  id: number,
  data: {
    status: DocumentStatus;
    title: string;
    description: string;
    roles: string[];
  },
) {
  await prisma.document.update({
    where: { id },
    data: {
      status: data.status,
      title: data.title,
      description: data.description,
      updatedAt: new Date(),
    },
  });

  const roles = await getRoles();

  await prisma.documentRole.deleteMany({ where: { documentId: id } });

  await prisma.documentRole.createMany({
    data: data.roles.map(role => ({
      documentId: id,
      roleId: roles.find(r => r.name === role)?.id ?? 0,
    })),
  });

  revalidatePath('/');
}
