'use server';
import { auth } from '@/auth';

export default async function HomePage() {
  const user = await auth();
  return <p>{JSON.stringify(user)}</p>;
}
