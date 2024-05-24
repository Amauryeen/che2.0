'use server';

import { auth } from '@/auth';
import { Session } from 'next-auth';

export async function getSession(): Promise<Session | null> {
  return await auth();
}
