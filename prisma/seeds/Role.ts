import prisma from '../../lib/database';

export default async function main() {
  const orders = [];

  orders.push(
    await prisma.role.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Invité',
      },
    }),
  );

  orders.push(
    await prisma.role.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Membre Adhérent',
      },
    }),
  );

  orders.push(
    await prisma.role.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Membre Effectif',
      },
    }),
  );

  orders.push(
    await prisma.role.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Administrateur',
      },
    }),
  );

  orders.push(
    await prisma.role.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Gestionnaire',
      },
    }),
  );

  return orders;
}
