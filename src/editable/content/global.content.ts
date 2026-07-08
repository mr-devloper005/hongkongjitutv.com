import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Independent reference library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Independent reference library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Open the library', href: '/pdf' },
      secondary: { label: 'Suggest a reference', href: '/contact' },
    },
  },
  footer: {
    tagline: 'A calm, curated reference library',
    description: 'An independent reference library where cited resources, collections, and contributor notes stay easy to browse and easy to trust.',
    columns: [
      {
        title: 'Discovery',
        links: [
          { label: 'Reference Library', href: '/pdf' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'Built for slow reading, careful citation, and calm discovery.',
  },
  commonLabels: {
    readMore: 'Open reference',
    viewAll: 'View library',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related references',
    published: 'Published',
  },
} as const
