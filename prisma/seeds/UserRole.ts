import prisma from '../../lib/database';

export default async function main() {
  const userRoles = [];

  userRoles.push(
    await prisma.userRole.upsert({
      where: { id: 1 },
      update: {},
      create: {
        userId: 1,
        roleId: 3,
      },
    }),
  );

  userRoles.push(
    await prisma.userRole.upsert({
      where: { id: 2 },
      update: {},
      create: {
        userId: 1,
        roleId: 4,
      },
    }),
  );

  userRoles.push(
    await prisma.userRole.upsert({
      where: { id: 3 },
      update: {},
      create: {
        userId: 1,
        roleId: 5,
      },
    }),
  );

  userRoles.push(
    await prisma.userRole.upsert({
      where: { id: 4 },
      update: {},
      create: {
        userId: 2,
        roleId: 1,
      },
    }),
  );

  return userRoles;
}
