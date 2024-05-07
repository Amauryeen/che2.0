import Role from './seeds/Role';
import User from './seeds/User';
import UserRole from './seeds/UserRole';

async function main() {
  const roles = await Role();
  console.log(`\u2795 ${roles.length} Role entries seeded.`);

  const users = await User();
  console.log(`\u2795 ${users.length} User entries seeded.`);

  const userRoles = await UserRole();
  console.log(`\u2795 ${userRoles.length} UserRole entries seeded.`);
}

main();
