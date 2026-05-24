/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile R3F + drei + postprocessing — they ship as ESM modules
  // that Next still needs to compile through SWC for SSR.
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'postprocessing',
  ],
  images: {
    // Allow inlining the real photos that live in StudioWork once they
    // are curated into /public/images. Wildcard kept narrow to local.
    remotePatterns: [
      { protocol: 'https', hostname: 'i0.wp.com' }, // legacy WordPress source
    ],
  },
  // Three.js & drei pull in .glsl / .vs / .fs raw imports occasionally —
  // configure webpack so future shader files load cleanly.
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });
    return config;
  },
};

module.exports = nextConfig;
