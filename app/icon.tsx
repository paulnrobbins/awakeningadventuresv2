import { ImageResponse } from 'next/og';

/**
 * Favicon — generated at build time. Single fire-amber dot on
 * night-black, matching the brand's "lit window in the dark" feel.
 *
 * Generated rather than shipped as a binary so the brand stays in
 * one editable place.
 */
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F5EFE2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#C77A3A',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
