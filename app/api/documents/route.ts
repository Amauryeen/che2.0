import { auth } from '@/auth';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (
    !session ||
    !session?.user.roles.some((role: any) => role.role.name === 'Gestionnaire')
  ) {
    return new NextResponse(null, {
      status: 401,
    });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  const blob = await put(
    `che2.0/${process.env.NODE_ENV}/${name}`,
    request.body as any,
    {
      access: 'public',
    },
  );

  return new NextResponse(blob.url, {
    status: 201,
  });
}
