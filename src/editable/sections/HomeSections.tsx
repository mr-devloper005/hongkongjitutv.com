import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BookOpenCheck, Library, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent } from '@/editable/content/global.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import {
  CompactIndexCard,
  EditorialFeatureCard,
  RailPostCard,
  postHref,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ------------------------------- Hero ---------------------------------- */

export function EditableHomeHero({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const hero = pagesContent.home.hero
  const heroTitle = hero.title?.join(' ') || `A calm reference library for ${SITE_CONFIG.name}`
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const collectionCount = timeSections.length || 24
  const referenceCount = pool.length ? `${Math.max(pool.length, 100)}+` : '100+'
  const metricLabel = `${collectionCount} collections · ${referenceCount} references`

  return (
    <section className={`${pal.pageBg} ${pal.pageText}`}>
      <div className={`${dc.shell.container} ${dc.shell.sectionY}`}>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <EditableReveal index={0}>
            <div className="max-w-2xl">
              <p className={dc.type.eyebrow}>
                <span className={`h-1.5 w-1.5 rounded-full ${pal.accentBg}`} aria-hidden />
                {hero.badge}
              </p>
              <h1 className={`mt-6 ${dc.type.heroTitle}`}>{heroTitle}</h1>
              <p className={`mt-6 max-w-xl ${dc.type.bodyLg}`}>{hero.description}</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href={primaryRoute || hero.primaryCta.href} className={dc.button.primary}>
                  {hero.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={hero.secondaryCta.href} className={dc.button.secondary}>
                  {hero.secondaryCta.label}
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2" aria-hidden>
                  <span className={`h-2 w-8 rounded-full ${pal.accentBg}`} />
                  <span className="h-2 w-4 rounded-full bg-[var(--slot4-page-text)]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--editable-border-strong)]" />
                </div>
                <p className={`${dc.type.label}`}>{metricLabel}</p>
              </div>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div className={`relative ${dc.surface.card} overflow-hidden p-6 sm:p-8`}>
              <div className="flex items-center justify-between">
                <p className={dc.type.eyebrow}>
                  <span className={`h-1.5 w-1.5 rounded-full ${pal.accentBg}`} aria-hidden />
                  {hero.featureCardBadge}
                </p>
                <span className={`${dc.badge.pill}`}>Live</span>
              </div>
              {/* Stylized reference-preview mock — pure divs, no images. */}
              <div className="mt-6 space-y-4">
                <div className="rounded-[14px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-5">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full ${pal.accentSoftBg} ${pal.accentText}`}>
                      <BookOpenCheck className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="h-2.5 w-32 rounded-full bg-[var(--slot4-page-text)]/85" />
                      <div className="mt-2 h-2 w-20 rounded-full bg-[var(--editable-border-strong)]" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 w-full rounded-full bg-[var(--editable-border)]" />
                    <div className="h-2 w-11/12 rounded-full bg-[var(--editable-border)]" />
                    <div className="h-2 w-9/12 rounded-full bg-[var(--editable-border)]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[14px] border border-[var(--editable-border)] p-4">
                    <p className={`${dc.type.label} ${pal.accentText}`}>Collection</p>
                    <div className="mt-3 h-2 w-16 rounded-full bg-[var(--slot4-page-text)]/80" />
                    <div className="mt-2 h-2 w-24 rounded-full bg-[var(--editable-border-strong)]" />
                  </div>
                  <div className={`rounded-[14px] p-4 ${pal.darkBg} text-white`}>
                    <p className={`font-[var(--editable-font-mono)] text-[11px] uppercase tracking-[0.14em] text-white/70`}>Citation</p>
                    <div className="mt-3 h-2 w-14 rounded-full bg-white/80" />
                    <div className="mt-2 h-2 w-20 rounded-full bg-white/40" />
                  </div>
                </div>
                <div className="rounded-[14px] border border-[var(--editable-border)] p-5">
                  <div className="flex items-center justify-between">
                    <div className="h-2 w-24 rounded-full bg-[var(--slot4-page-text)]/70" />
                    <span className={`${dc.type.label} ${pal.accentText}`}>Ref. 042</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-full rounded-full bg-[var(--editable-border)]" />
                    <div className="h-2 w-10/12 rounded-full bg-[var(--editable-border)]" />
                  </div>
                </div>
              </div>
            </div>
          </EditableReveal>
        </div>
      </div>
      <div className="w-full border-b border-[var(--slot4-page-text)]" aria-hidden />
    </section>
  )
}

/* -------------------------- Feature bento (3 up) ----------------------- */

const featureBento = [
  {
    icon: Library,
    eyebrow: 'Curated collections',
    title: 'Grouped by intent, not chaos.',
    body: 'Every reference sits inside a working collection so context, related sources, and contributor notes stay one click away.',
  },
  {
    icon: Search,
    eyebrow: 'Fast search',
    title: 'Find a citation in a keystroke.',
    body: 'Keyword and topic search moves calmly across titles, summaries, and collections without noisy filters.',
  },
  {
    icon: BookOpenCheck,
    eyebrow: 'Cited sources',
    title: 'Every entry keeps its source.',
    body: 'Citations, contributor credit, and the underlying reference stay visible so readers can verify what they see.',
  },
] as const

export function EditableStoryRail(_props: HomeSectionProps) {
  return (
    <section className={`${pal.pageBg} ${pal.pageText}`}>
      <div className={`${dc.shell.container} ${dc.shell.sectionYTight}`}>
        <EditableReveal index={0}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className={dc.type.eyebrow}>
                <span className={`h-1.5 w-1.5 rounded-full ${pal.accentBg}`} aria-hidden />
                Why the library
              </p>
              <h2 className={`mt-5 ${dc.type.sectionTitle}`}>Built for calm reading and honest citation.</h2>
            </div>
            <p className={`max-w-md ${dc.type.body}`}>
              Three quiet ideas hold the library together — grouping, finding, and citing — so the reference stays in view at every step.
            </p>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {featureBento.map((item, index) => {
            const Icon = item.icon
            return (
              <EditableReveal key={item.eyebrow} index={index + 1}>
                <article className={`${dc.surface.card} h-full p-8 ${dc.motion.lift}`}>
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${pal.accentSoftBg} ${pal.accentText}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className={`mt-6 ${dc.type.eyebrow}`}>{item.eyebrow}</p>
                  <h3 className={`mt-3 ${dc.type.subTitle}`}>{item.title}</h3>
                  <p className={`mt-4 ${dc.type.body}`}>{item.body}</p>
                </article>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ----------------------- Latest references (dark) ---------------------- */

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  if (!pool.length) return null
  const featured = pool[0]
  const rail = pool.slice(1, 4)

  return (
    <section className={`${dc.shell.darkBand}`}>
      <div className={`${dc.shell.container} ${dc.shell.sectionY}`}>
        <EditableReveal index={0}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
                <span className={`h-1.5 w-1.5 rounded-full ${pal.accentBg}`} aria-hidden />
                Latest references
              </p>
              <h2 className={`mt-5 font-[var(--editable-font-display)] text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-white sm:text-[44px] lg:text-[52px]`}>
                Fresh entries on the library shelf.
              </h2>
            </div>
            <Link
              href={primaryRoute}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/85 transition duration-200 hover:text-white"
            >
              {globalContent.commonLabels.viewAll}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <EditableReveal index={1}>
            <EditorialFeatureCard
              post={featured}
              href={postHref(primaryTask, featured, primaryRoute)}
              label="Featured reference"
            />
          </EditableReveal>
          <div className="flex flex-col gap-6">
            {rail.map((post, index) => (
              <EditableReveal key={post.id || post.slug || post.title} index={index + 2}>
                <div className="[&_a]:w-full">
                  <RailPostCard
                    post={post}
                    href={postHref(primaryTask, post, primaryRoute)}
                    index={index}
                  />
                </div>
              </EditableReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------- Collections / time sections -------------------- */

const timeSectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'This week', title: 'Recently added to the shelf' },
  browse: { eyebrow: 'Working set', title: 'Popular in the collections' },
  index: { eyebrow: 'Archive', title: 'From the deeper stacks' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 6), href: primaryRoute },
          { key: 'browse', posts: posts.slice(6, 12), href: primaryRoute },
          { key: 'index', posts: posts.slice(12, 18), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <section className={`${pal.pageBg} ${pal.pageText}`}>
      <div className={`${dc.shell.container} ${dc.shell.sectionY}`}>
        <EditableReveal index={0}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className={dc.type.eyebrow}>
                <span className={`h-1.5 w-1.5 rounded-full ${pal.accentBg}`} aria-hidden />
                Collections
              </p>
              <h2 className={`mt-5 ${dc.type.sectionTitle}`}>Move calmly between working collections.</h2>
              <p className={`mt-6 max-w-xl ${dc.type.body}`}>
                Each collection groups related references so you can follow a source without losing the surrounding context.
              </p>
            </div>
            <Link href={primaryRoute} className={dc.button.ghost}>
              Browse all collections
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-14 space-y-16">
          {visible.map((section, sectionIndex) => {
            const copy = timeSectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
            return (
              <div key={section.key}>
                <EditableReveal index={sectionIndex * 4}>
                  <div className="flex flex-col gap-4 border-t border-[var(--editable-border)] pt-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className={dc.type.eyebrow}>{copy.eyebrow}</p>
                      <h3 className={`mt-3 ${dc.type.subTitle}`}>{copy.title}</h3>
                    </div>
                    <Link
                      href={section.href || primaryRoute}
                      className={dc.button.ghost}
                    >
                      Open collection
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </EditableReveal>
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {section.posts.slice(0, 6).map((post, index) => (
                    <EditableReveal key={post.id || post.slug || post.title} index={sectionIndex * 4 + index + 1}>
                      <CompactIndexCard
                        post={post}
                        href={postHref(primaryTask, post, primaryRoute)}
                        index={index}
                      />
                    </EditableReveal>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- CTA --------------------------------- */

export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section className={`${dc.shell.darkBand}`}>
      <div className={`${dc.shell.container} ${dc.shell.sectionY}`}>
        <EditableReveal index={0}>
          <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 text-left">
            <p className="inline-flex items-center gap-2 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
              <span className={`h-1.5 w-1.5 rounded-full ${pal.accentBg}`} aria-hidden />
              {cta.badge}
            </p>
            <h2 className="font-[var(--editable-font-display)] text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[56px] lg:text-[68px]">
              Start exploring the library.
            </h2>
            <p className="max-w-2xl text-lg leading-[1.6] text-white/75">{cta.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/pdf"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[var(--slot4-dark-bg)] transition duration-200 hover:bg-white/90 active:scale-[0.98]"
              >
                {cta.primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition duration-200 hover:border-white/60 active:scale-[0.98]"
              >
                Contact us
              </Link>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
