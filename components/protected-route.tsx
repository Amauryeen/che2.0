'use client';
import { getSession } from '@/services/auth';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import Unauthorized from './errors/unauthorized';

export default function ProtectedRoute({
  children,
  authorizedRoles,
}: {
  children: React.ReactNode;
  authorizedRoles: string[];
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((response: Session | null) => {
      response ? setSession(response) : null;
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading ? (
        <p>Chargement...</p>
      ) : session?.user.roles.some((role: any) =>
          authorizedRoles.some(
            authorizedRole => authorizedRole == role.role.name,
          ),
        ) ? (
        children
      ) : (
        <Unauthorized />
      )}
    </>
  );
}
