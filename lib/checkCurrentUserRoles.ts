'use server';
import { auth } from '@/auth';

export default async function checkCurrentUserRoles(roles: string[]) {
  const session = await auth();
  return session?.user.roles.some(role => roles.includes(role.name));
}
