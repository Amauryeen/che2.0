'use server';
import { auth } from '@/auth';

export default async function HomePage() {
  const session = await auth();
  return (
    <p>
      Bienvenue <b>{session?.user.firstName}</b> !
    </p>
  );
}
