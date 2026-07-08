import type { CSSProperties } from 'react'

/*
  Ovo-protocol reference design contract.

  White dominant surfaces + dark #050b1a contrast bands + saturated blue
  #2563eb accent. Pill buttons, bordered flat 20px cards, mono eyebrows,
  ultra-tight negative tracking on large headings. All-sans typography.
*/

export const editableRootStyle = {
  // Warm cream base + soft lavender/teal accents (custom brand palette).
  '--slot4-page-bg': '#F2EAE0',
  '--slot4-page-text': '#2A2540',
  '--slot4-panel-bg': '#FBF6EF',
  '--slot4-surface-bg': '#FFFFFF',
  '--slot4-muted-text': '#6B647A',
  '--slot4-soft-muted-text': '#9C95A8',
  '--slot4-accent': '#9B8EC7',
  '--slot4-accent-fill': '#9B8EC7',
  '--slot4-accent-hover': '#7F74B0',
  '--slot4-accent-soft': '#BDA6CE',
  '--slot4-accent-strong': 'rgba(155,142,199,0.30)',
  '--slot4-secondary': '#B4D3D9',
  '--slot4-secondary-soft': 'rgba(180,211,217,0.35)',
  '--slot4-on-accent': '#FFFFFF',
  '--slot4-dark-bg': '#2A2540',
  '--slot4-dark-text': '#F2EAE0',
  '--slot4-dark-muted': 'rgba(242,234,224,0.72)',
  '--slot4-media-bg': '#EDE3D5',
  '--slot4-cream': '#F2EAE0',
  '--slot4-warm': '#FBF6EF',
  '--slot4-lavender': '#BDA6CE',
  '--slot4-gray': '#EDE3D5',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#F2EAE0',
  '--editable-page-text': '#2A2540',
  '--editable-container': '1440px',
  '--editable-border': '#E6DCCF',
  '--editable-border-strong': '#B4D3D9',
  '--editable-nav-bg': '#F2EAE0',
  '--editable-nav-text': '#2A2540',
  '--editable-nav-active': '#9B8EC7',
  '--editable-nav-active-text': '#FFFFFF',
  '--editable-cta-bg': '#9B8EC7',
  '--editable-cta-text': '#FFFFFF',
  '--editable-search-bg': '#FFFFFF',
  '--editable-footer-bg': '#2A2540',
  '--editable-footer-text': '#F2EAE0',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_1px_2px_rgba(5,11,26,0.04)]',
  shadowStrong: 'shadow-[0_20px_48px_-24px_rgba(5,11,26,0.35)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(5,11,26,0.05),rgba(5,11,26,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    container: 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-12',
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-12',
    sectionY: 'py-20 sm:py-24 lg:py-32',
    sectionYTight: 'py-14 sm:py-16 lg:py-20',
    darkBand: 'bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    // Mono eyebrow chip
    eyebrow:
      'inline-flex items-center gap-2 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]',
    // Huge display h1 — 62px scale, tight negative tracking
    heroTitle:
      'font-[var(--editable-font-display)] text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[76px]',
    sectionTitle:
      'font-[var(--editable-font-display)] text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--slot4-page-text)] sm:text-[44px] lg:text-[52px]',
    subTitle:
      'font-[var(--editable-font-display)] text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-[30px]',
    body: 'text-base leading-[1.6] text-[var(--slot4-muted-text)]',
    bodyLg: 'text-lg leading-[1.6] text-[var(--slot4-muted-text)]',
    emphasis: 'font-semibold text-[var(--slot4-page-text)]',
    label:
      'font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]',
  },
  badge: {
    pill:
      'inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--slot4-muted-text)]',
    accentPill:
      'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--slot4-accent)]',
    darkPill:
      'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.12em] text-white/80',
  },
  surface: {
    card: `rounded-[20px] border border-[var(--editable-border)] ${editablePalette.surfaceBg}`,
    soft: `rounded-[20px] border border-[var(--editable-border)] ${editablePalette.panelBg}`,
    dark: `rounded-[20px] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    input:
      'rounded-[12px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm text-[var(--slot4-page-text)] placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--slot4-accent-soft)]',
  },
  button: {
    // Pill primary — solid lavender accent with white text
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[var(--slot4-accent-hover)] active:scale-[0.98]',
    // Pill secondary — bordered on surface
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition duration-200 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] active:scale-[0.98]',
    // Pill accent — deep aubergine (dark contrast)
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[color-mix(in_oklab,var(--slot4-dark-bg)_82%,white)] active:scale-[0.98]',
    // Text-only ghost with arrow
    ghost:
      'inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-page-text)] transition duration-200 hover:text-[var(--slot4-accent)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[20px] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-[24px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[16/10]',
    ratioSquare: 'aspect-square',
    ratioPortrait: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:border-[var(--editable-border-strong)]',
    fade: 'transition duration-300 hover:opacity-90',
    zoom: 'transition duration-500 group-hover:scale-[1.03]',
  },
} as const

export const aiLayoutRules = [
  'All colors, fonts, radii and section rhythm live in editableRootStyle + editable-global.css — never hardcode them per component.',
  'Home + archive + detail pages must mirror the reference section rhythm.',
  'Public UI is Reference Library only; profiles never appear in nav, footer, home, cards, search, or archives.',
  'Wrap section headers and grid items in EditableReveal for staggered fade + slide-up.',
  'Buttons are pill (rounded-full); cards are rounded-[20px] with a 1px border.',
  'Use eyebrow labels (mono, uppercase, tracked) for section kickers.',
] as const
