import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Reading desk',
    headline: 'Long-form notes with a calm editorial rhythm.',
    description: 'Use this surface for essays, guides, and explainers that sit alongside the reference library. The layout should read like a publication, not a directory.',
    filterLabel: 'Choose topic',
    secondaryNote: 'Reading surfaces need space, hierarchy, and fewer distractions.',
    chips: ['Editorial pacing', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Short notices, updates, and time-sensitive posts.',
    description: 'Notice-board entries should feel quick to scan, practical, and action-oriented with less editorial decoration.',
    filterLabel: 'Filter notice category',
    secondaryNote: 'Prioritize urgency, short summaries, and direct browsing.',
    chips: ['Fast scan', 'Updates', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Saved resources',
    headline: 'Bookmarks arranged like curated collections.',
    description: 'This surface should feel like shelves of useful resources, tools, and references, grouped by intent rather than by source.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need grouping and calm metadata.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    eyebrow: 'Contributor',
    headline: 'The people and teams behind the references.',
    description: 'A contributor page introduces the person or team who added a reference — their focus areas, their notes, and a way to reach them for follow-up.',
    filterLabel: 'Filter contributors',
    secondaryNote: 'Show identity, verification, and how to make contact before the entries begin.',
    chips: ['Verified authors', 'Contact info', 'Bio & links'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'A curated reference library organised for calm reading.',
    description: 'The library holds cited references, working collections, and contributor notes arranged for scholarly browsing rather than quick clicks.',
    filterLabel: 'Filter by collection',
    secondaryNote: 'Every entry keeps its citation and its collection visible before the reader opens it.',
    chips: ['Cited sources', 'Collections', 'Offline-friendly'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Directory entries built for discovery and comparison.',
    description: 'Directory pages should behave like a considered index — trust cues, metadata, and a practical search rhythm.',
    filterLabel: 'Filter directory category',
    secondaryNote: 'Prioritize comparison, location, and direct action paths.',
    chips: ['Directory', 'Compare', 'Considered discovery'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Visual entries with a gallery-first browsing rhythm.',
    description: 'The visual surface leads with imagery, stronger cards, and a portfolio-like pace that keeps the reader looking.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
