import { getCurrentUser } from '@/services/users';

export default async function checkCurrentUserRoles(roles: string[]) {
  const user = await getCurrentUser();
  return user?.roles.some(role => roles.includes(role.role.name));
}
