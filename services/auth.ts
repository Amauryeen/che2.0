'use server';

import { auth, signOut as sOut } from '@/auth';
import { Session } from 'next-auth';

export async function getSession(): Promise<Session | null> {
  return await auth();
}

export async function signOut(callback: string): Promise<void> {
  return await sOut({ redirectTo: callback });
}
