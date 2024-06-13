'use client';
import { useEffect } from 'react';

export default function Unauthenticated(props: any) {
  useEffect(() => {
    props.logIn();
  }, [props]);

  return <></>;
}
