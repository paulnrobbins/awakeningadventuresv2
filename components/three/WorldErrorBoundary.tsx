'use client';

import { Component, ReactNode } from 'react';

interface State {
  hasError: boolean;
  message?: string;
}

/**
 * Catches any error thrown inside the 3D world (missing HDRI, missing
 * GLB, missing photo, WebGL context lost, etc.) and renders nothing —
 * the rest of the page (DOM scenes, footer, nav) stays intact.
 *
 * Suspense catches loading PROMISES; this catches loading ERRORS. Both
 * are needed in a world that depends on asset files that may not be
 * present in all environments.
 */
export class WorldErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message };
  }

  componentDidCatch(error: Error) {
    // Surface the error in the browser console so debugging stays cheap.
    // No user-facing surface — the page keeps working without the world.
    if (typeof console !== 'undefined') {
      console.warn('[WorldErrorBoundary] 3D world failed to render:', error);
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
