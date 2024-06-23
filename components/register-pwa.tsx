'use client';
import { useEffect } from 'react';
import type { Workbox } from 'workbox-window';
declare global {
  interface Window {
    workbox: Workbox;
  }
}
export default function RegisterPWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.workbox !== undefined) {
      window.workbox.register();
    }
  }, []);
  return <></>;
}
