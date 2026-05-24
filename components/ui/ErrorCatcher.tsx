'use client';

import { useEffect, useState } from 'react';

/**
 * Catches uncaught errors at the window level and surfaces them in
 * the DOM so Vercel users without dev tools open can see what broke.
 * Strictly a temporary debug aid — Phase 5+ removes once the build
 * stabilizes.
 */
export function ErrorCatcher() {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      const msg = `${e.message}\n  at ${e.filename}:${e.lineno}:${e.colno}`;
      setErrors((prev) => (prev.length < 5 ? [...prev, msg] : prev));
      // Log to console too so dev tools still see it
      console.error('[ErrorCatcher]', e.error || e.message);
    };
    const onReject = (e: PromiseRejectionEvent) => {
      const msg = `Unhandled promise: ${e.reason?.message ?? String(e.reason)}`;
      setErrors((prev) => (prev.length < 5 ? [...prev, msg] : prev));
      console.error('[ErrorCatcher]', e.reason);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onReject);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onReject);
    };
  }, []);

  if (errors.length === 0) return null;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        bottom: '6rem',
        left: '1rem',
        right: '1rem',
        maxWidth: '40rem',
        padding: '1rem 1.25rem',
        background: 'rgba(11, 15, 20, 0.95)',
        border: '1px solid rgba(199, 122, 58, 0.7)',
        borderRadius: '6px',
        color: '#F2E9D8',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: '12px',
        lineHeight: 1.5,
        zIndex: 9999,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxHeight: '40vh',
        overflowY: 'auto',
      }}
    >
      <strong style={{ color: '#C77A3A' }}>Runtime error</strong>
      {errors.map((e, i) => (
        <div key={i} style={{ marginTop: '0.6rem' }}>{e}</div>
      ))}
    </div>
  );
}
