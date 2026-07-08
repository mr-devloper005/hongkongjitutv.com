import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Ovo-protocol reference: one shared visual language across every task
  surface (--tk-* tokens). Only the kicker/note copy varies per task; the
  palette + typography come from the reference (white surfaces, dark #050b1a
  contrast bands, saturated blue #2563eb accent, Space Grotesk + IBM Plex
  Sans + IBM Plex Mono).

  Public-facing tasks (pdf) center the Reference Library. The profile task
  key is kept for internal routing but is NEVER surfaced publicly — its
  kicker/note copy is only used on the direct-URL Contributor detail page.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  fontMono: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const FONT_DISPLAY = "'Space Grotesk', Arial, system-ui, sans-serif"
const FONT_BODY = "'IBM Plex Sans', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const FONT_MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

const base = {
  dark: false,
  fontDisplay: FONT_DISPLAY,
  fontBody: FONT_BODY,
  fontMono: FONT_MONO,
  bg: '#F2EAE0',
  surface: '#FFFFFF',
  raised: '#FBF6EF',
  text: '#2A2540',
  muted: '#6B647A',
  line: '#E6DCCF',
  accent: '#9B8EC7',
  accentSoft: 'rgba(189,166,206,0.30)',
  onAccent: '#FFFFFF',
  glow: 'rgba(180,211,217,0.45)',
  radius: '20px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Field notes',
    note: 'Long-form context for the reference library.',
  },
  listing: {
    ...base,
    kicker: 'Directory',
    note: 'Sources and destinations worth knowing.',
  },
  classified: {
    ...base,
    kicker: 'Updates',
    note: 'Time-sensitive announcements from the archive.',
  },
  image: {
    ...base,
    kicker: 'Visuals',
    note: 'A visual index of standout material.',
  },
  sbm: {
    ...base,
    kicker: 'Collections',
    note: 'Curated resource shelves.',
  },
  // Public-facing task: the Reference Library.
  pdf: {
    ...base,
    kicker: 'Reference Library',
    note: 'Cited references, guides, and reports built for calm reading.',
  },
  // Contributor: label appears ONLY on the direct-URL profile detail page.
  profile: {
    ...base,
    kicker: 'Contributor',
    note: 'The person or team behind these reference materials.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.pdf
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    '--editable-font-mono': t.fontMono,
    fontFamily: t.fontBody,
  } as CSSProperties
}
