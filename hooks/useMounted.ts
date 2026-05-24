'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true after first client mount. Use to gate any rendering
 * that depends on browser-only APIs and to eliminate hydration
 * mismatch crashes — the server always sees `false`, the client
 * flips to `true` after hydration completes.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}
