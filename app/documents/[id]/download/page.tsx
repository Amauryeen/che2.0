'use server';

import { auth } from '@/auth';
import NotFound from '@/components/errors/not-found';
import Unauthorized from '@/components/errors/unauthorized';
import { getDocumentById } from '@/services/documents';
import Download from './download';

export default async function Page({ params }: { params: { id: string } }) {
  const documentId = parseInt(params.id);
  const document: any = await getDocumentById(documentId);

  if (!document) return <NotFound />;

  const session = await auth();

  if (
    session?.user.roles.some((role: any) =>
      document.roles.some(
        (authorizedRole: any) => authorizedRole.role.name == role.role.name,
      ),
    )
  ) {
    return <Download url={document.url} />;
  } else
    return (
      <Unauthorized roles={document.roles.map((role: any) => role.role.name)} />
    );
}
