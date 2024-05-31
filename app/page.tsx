'use server';
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  return (
    <p>
      Bienvenue <b>{session?.user.firstName}</b> !
    </p>
  );
}
