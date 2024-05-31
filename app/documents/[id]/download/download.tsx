'use client';

import { useEffect } from 'react';

export default function Download(props: { url: string }) {
  useEffect(() => {
    window.location.href = props.url + '?download=1';
  }, [props.url]);

  return <>Téléchargement du document en cours...</>;
}
