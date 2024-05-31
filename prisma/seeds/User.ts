import { MeetingPresence } from '@prisma/client';
import prisma from '../../lib/database';
import { fakerFR as faker } from '@faker-js/faker';

export default async function main() {
  const users = [];

  users.push(
    await prisma.user.create({
      data: {
        status: 'active',
        email: 'a.grotard@students.ephec.be',
        lastName: 'GROTARD',
        firstName: 'Amaury',
        roles: {
          create: [
            {
              roleId: 3,
            },
            {
              roleId: 4,
            },
            {
              roleId: 5,
            },
          ],
        },
      },
    }),
  );

  for (let i = 0; i < 40; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = `${firstName.slice(0, 1)}.${lastName}@ephec.be`.toLowerCase();

    users.push(
      await prisma.user.create({
        data: {
          status: 'active',
          email: email,
          lastName: lastName.toUpperCase(),
          firstName: firstName,
          roles: {
            create: {
              roleId: 3,
            },
          },
          meetings: {
            create: {
              meetingId: 1,
              presence: [
                MeetingPresence.present,
                MeetingPresence.excused,
                MeetingPresence.unknown,
              ][Math.floor(Math.random() * 3)],
            },
          },
        },
      }),
    );
  }

  for (let i = 0; i < 5; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = `${firstName.slice(0, 1)}.${lastName}@ephec.be`.toLowerCase();

    users.push(
      await prisma.user.create({
        data: {
          status: 'inactive',
          email: email,
          lastName: lastName,
          firstName: firstName,
          roles: {
            create: {
              roleId: 1,
            },
          },
        },
      }),
    );
  }

  return users;
}
