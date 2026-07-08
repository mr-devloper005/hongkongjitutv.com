'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and bring your business surface live quickly.' },
      { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup questions.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the directory around it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
      { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
      { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards, and links that deserve a place in the library.' },
    { icon: Mail, title: 'Reference partnerships', body: 'Coordinate curation projects, reference pages, and link programs.' },
    { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves, collections, or contributor-connected boards?' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className={dc.shell.page}>
        <section className={`${dc.shell.section} pt-16 sm:pt-20 lg:pt-24 ${dc.shell.sectionYTight}`}>
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <EditableReveal>
              <p className={dc.type.eyebrow}>{pagesContent.contact.eyebrow}</p>
              <h1 className={`${dc.type.heroTitle} mt-5 max-w-2xl`}>{pagesContent.contact.title}</h1>
              <p className={`${dc.type.bodyLg} mt-6 max-w-xl`}>{pagesContent.contact.description}</p>
              <div className="mt-10 grid gap-4">
                {lanes.map((lane, index) => (
                  <EditableReveal key={lane.title} index={index + 1}>
                    <div className={`${dc.surface.card} flex gap-4 p-6`}>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                        <lane.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="font-[var(--editable-font-display)] text-lg font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)]">{lane.title}</h2>
                        <p className={`${dc.type.body} mt-2 text-sm`}>{lane.body}</p>
                      </div>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className={`${dc.surface.card} p-8 lg:p-10`}>
                <p className={dc.type.eyebrow}>Send a message</p>
                <h2 className={`${dc.type.subTitle} mt-4`}>{pagesContent.contact.formTitle}</h2>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
