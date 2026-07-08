import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A curated reference library for careful readers',
      description: 'Browse a calmly organised reference library of cited resources, collections, and contributor notes.',
      openGraphTitle: 'A curated reference library for careful readers',
      openGraphDescription: 'A calmly organised reference library — cited resources, considered collections, and clear contributor notes.',
      keywords: ['reference library', 'curated resources', 'citations', 'research collections'],
    },
    hero: {
      badge: 'Curated reference library',
      title: ['A calm home for cited', 'references and considered collections.'],
      description: 'A quiet reading surface for curated references, working collections, and contributor notes — organised so each source keeps its context.',
      primaryCta: { label: 'Explore the library', href: '/pdf' },
      secondaryCta: { label: 'How it works', href: '/about' },
      searchPlaceholder: 'Search references, collections, topics',
      focusLabel: 'Focus',
      featureCardBadge: 'recently added references',
      featureCardTitle: 'Newly added references shape what you see on the library shelf.',
      featureCardDescription: 'Recently added references sit at the front of the library without changing the underlying navigation or structure.',
    },
    intro: {
      badge: 'About the library',
      title: 'A reference library built for slow reading, clear citation, and calm browsing.',
      paragraphs: [
        'This is a place to sit with a reference for a while — to read carefully, follow the citation, and move on to the next one without noise.',
        'Instead of scattering references across disconnected pages, the library keeps each entry, its collection, and its contributor within reach.',
        'You can start with a single reference, follow it into a wider collection, or explore what a contributor has added — the path stays continuous.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'A reading-first library shelf with each reference kept in its own context.',
        'Collections that group related references without hiding the source.',
        'Contributor notes and citations that stay legible on every screen.',
        'A lightweight, quiet interface that keeps the focus on the material.',
      ],
      primaryLink: { label: 'Browse the library', href: '/pdf' },
      secondaryLink: { label: 'Read about the project', href: '/about' },
    },
    cta: {
      badge: 'Start with a reference',
      title: 'Sit with a curated reference, then follow it into a wider collection.',
      description: 'Open a single entry, read the notes, check the citation, and move calmly through the collections it belongs to.',
      primaryCta: { label: 'Open the library', href: '/pdf' },
      secondaryCta: { label: 'Contact the editors', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Recently added entries in this part of the library.',
    },
  },
  about: {
    badge: 'About the project',
    title: 'A calmer, clearer reference library.',
    description: `${slot4BrandConfig.siteName} is an independent reference library — a quiet place to browse cited resources, considered collections, and contributor notes.`,
    paragraphs: [
      'The library is arranged so each reference keeps its context: who added it, which collection it belongs to, and where it can be verified.',
      'Whether you arrive through a single citation, a working collection, or a contributor page, the surrounding material stays close at hand.',
    ],
    values: [
      {
        title: 'Reading-first library',
        description: 'The shelf is organised for calm reading and careful citation — clear hierarchy, generous spacing, and no unnecessary noise.',
      },
      {
        title: 'Connected collections',
        description: 'Each reference is linked to its collection and its contributor so following a source never feels like starting over.',
      },
      {
        title: 'Trustworthy by default',
        description: 'Every entry keeps its citation, source, and contributor visible so readers can verify what they are looking at.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'A direct line to the editors, not a generic contact form.',
    description: 'Tell us what you want to add, correct, or ask about — a missing citation, a new collection, or a note about an existing reference. We route each message to the person who can actually answer it.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search the library',
      description: 'Search across references, collections, contributors, and topics in the library.',
    },
    hero: {
      badge: 'Search the library',
      title: 'Find a reference, a collection, or a contributor.',
      description: 'Use keywords, topics, or collection names to move across the library and surface the entries you need.',
      placeholder: 'Search by keyword, topic, collection, or title',
    },
    resultsTitle: 'Matching entries in the library',
  },
  create: {
    metadata: {
      title: 'Contribute a reference',
      description: 'Submit a new reference or collection to the library.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to contribute to the library.',
      description: 'Use your contributor account to open the submission workspace and add references, citations, or collection notes.',
    },
    hero: {
      badge: 'Contribution workspace',
      title: 'Add a reference to the library.',
      description: 'Choose the kind of entry, add the citation and summary, and prepare a clean submission with links, notes, and context.',
    },
    formTitle: 'Reference details',
    submitLabel: 'Submit reference',
    successTitle: 'Reference submitted for review.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to the reference library.',
      badge: 'Contributor access',
      title: 'Welcome back to the library.',
      description: 'Sign in to keep contributing references, managing submissions, and following the collections you care about.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create a contributor account first, then sign in.',
      success: 'Signed in. Redirecting...',
      createCta: 'Create a contributor account',
    },
    signup: {
      metadataDescription: 'Create a contributor account for the reference library.',
      badge: 'Contributor access',
      title: 'Create a contributor account.',
      description: 'A contributor account opens the submission workspace, keeps your notes together, and lets you propose new references and collections.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Contributor account created. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related notes',
      fallbackTitle: 'Reference notes',
    },
    listing: {
      relatedTitle: 'Related entries',
      fallbackTitle: 'Entry details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Visual details',
    },
    profile: {
      relatedTitle: 'More from this contributor',
      fallbackDescription: 'Contributor details will appear here once available.',
      visitButton: 'Contact contributor',
    },
  },
} as const
