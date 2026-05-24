import type { Config } from 'tailwindcss';

// Awakening Adventures — Tier 3 inhabitable world
// Color tokens map 1:1 to the Phase 1 brief color lock:
//   night     #0B0F14   Cumberland night sky (dominant)
//   cream     #F2E9D8   prairie cream (off-white)
//   amber     #C77A3A   warm fire-amber (single high-energy accent)
//   forest    #2C4A2E   environmental tint only — never UI
//
// Anti-AI-slop check: no purple gradients, no Tailwind defaults reused,
// no blue-to-purple, no mint-coral. The palette is documented in code
// so Phase 5 can verify nothing drifted.

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  // We deliberately do NOT extend Tailwind's default palette — colors are
  // exposed as CSS variables in styles/tokens.css and surfaced as named
  // utilities here, so a "text-amber-500" lookup fails fast and forces
  // intentional choice.
  theme: {
    // Replace, not extend.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // Absolute white + black — needed for solid white cards (SceneBook),
      // black overlays, and any place where the brand variables would be
      // wrong. Re-added because replacing (not extending) the palette
      // dropped them and `bg-white` silently became a no-op.
      white: '#ffffff',
      black: '#000000',
      night: 'rgb(var(--aa-night) / <alpha-value>)',
      cream: 'rgb(var(--aa-cream) / <alpha-value>)',
      amber: 'rgb(var(--aa-amber) / <alpha-value>)',
      forest: 'rgb(var(--aa-forest) / <alpha-value>)',
      // A single neutral helper for borders / scrims at 8–20% alpha.
      ink: 'rgb(var(--aa-cream) / <alpha-value>)',
    },
    fontFamily: {
      display: ['var(--font-display)', 'Georgia', 'serif'],
      sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      // Modular scale. Hero clamp tightened from 16vw→10vw so the
      // longest line ("Adventure of ALL.") fits inside the viewport
      // on every screen width. Body sits at 1.0625rem (17px).
      'hero': ['clamp(2.75rem, 10vw, 9rem)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
      'display': ['clamp(2.25rem, 6vw, 5rem)', { lineHeight: '0.96', letterSpacing: '-0.025em' }],
      'title': ['clamp(1.65rem, 3vw, 2.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      'lede': ['clamp(1.125rem, 1.6vw, 1.5rem)', { lineHeight: '1.45', letterSpacing: '-0.005em' }],
      'body': ['1.0625rem', { lineHeight: '1.62' }],
      'caption': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      'eyebrow': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.18em' }],
    },
    extend: {
      spacing: {
        // Macro whitespace tokens per Pillar 4. Section padding lands here.
        'section-y': 'clamp(6rem, 12vh, 14rem)',
        'section-x': 'clamp(1.5rem, 6vw, 8rem)',
      },
      transitionTimingFunction: {
        // Custom cubic-bezier for cinematic camera ease — matches the
        // GSAP defaults configured in lib/gsap.ts so CSS + GSAP feel
        // continuous when both run.
        'cinematic': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
