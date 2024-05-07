import prisma from '../../lib/database';

export default async function main() {
  const users = [];

  users.push(
    await prisma.user.upsert({
      where: { id: 1 },
      update: {},
      create: {
        status: 'active',
        email: 'a.grotard@students.ephec.be',
        lastName: 'GROTARD',
        firstName: 'Amaury',
      },
    }),
  );

  users.push(
    await prisma.user.upsert({
      where: { id: 2 },
      update: {},
      create: {
        status: 'inactive',
        email: 'j.doe@students.ephec.be',
        lastName: 'DOE',
        firstName: 'John',
      },
    }),
  );

  return users;
}
