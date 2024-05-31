import Meeting from './seeds/Meeting';
import Role from './seeds/Role';
import User from './seeds/User';

async function main() {
  const roles = await Role();
  console.log(`\u2795 ${roles.length} Role entries seeded.`);

  const meetings = await Meeting();
  console.log(`\u2795 ${meetings.length} Meeting entries seeded.`);

  const users = await User();
  console.log(`\u2795 ${users.length} User entries seeded.`);
}

main();
