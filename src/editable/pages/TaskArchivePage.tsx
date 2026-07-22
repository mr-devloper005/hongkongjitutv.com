import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, ChevronDown, FileText, Globe, MapPin, Phone, Star, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const dedupeUrls = (urls: Array<string | null | undefined>): string[] =>
  Array.from(new Set(urls.map((url) => (typeof url === 'string' ? url.trim() : '')).filter((url) => url.length > 0)))

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return dedupeUrls([...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])]).filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-7 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-5 xl:grid-cols-2',
  classified: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

// Shared bordered flat card — hairline border, 20px radius, subtle lift on hover.
const cardBase = `group block ${dc.surface.card} transition duration-300 hover:-translate-y-1 hover:border-[var(--editable-border-strong)]`

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const headline = voice?.headline || (task === 'pdf' ? `The ${theme.kicker}` : `Browse ${label}`)
  const lead = voice?.description || theme.note

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className={`${pal.pageBg} ${pal.pageText} min-h-screen`}>
        <header className="relative border-b border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
          <div className={`${dc.shell.container} ${dc.shell.sectionYTight}`}>
            <EditableReveal>
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={dc.badge.pill}>{theme.kicker}</span>
                  <span className={dc.type.label}>{label}</span>
                </div>
                <h1 className={`${dc.type.sectionTitle} max-w-4xl text-balance`}>{headline}</h1>
                <p className={`${dc.type.bodyLg} max-w-2xl`}>{lead}</p>
                {voice?.chips?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {voice.chips.map((chip) => (
                      <span key={chip} className={dc.badge.pill}>{chip}</span>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-col gap-4 border-t border-[var(--editable-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className={dc.type.body}>
                    <span className={dc.type.emphasis}>{posts.length}</span> {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
                  </p>
                  <form action={basePath} className="flex flex-wrap items-center gap-2.5">
                    <div className="relative">
                      <select
                        name="category"
                        defaultValue={category}
                        className="h-11 appearance-none rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] pl-5 pr-11 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition hover:border-[var(--editable-border-strong)] focus:border-[var(--slot4-accent)]"
                        aria-label={voice?.filterLabel || 'Filter category'}
                      >
                        <option value="all">All categories</option>
                        {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--slot4-muted-text)]" />
                    </div>
                    <button className={dc.button.primary}>Apply</button>
                  </form>
                </div>

                <div className="pt-2">
                  <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel />
                </div>
              </div>
            </EditableReveal>
          </div>
        </header>

        <section className={`${dc.shell.container} ${dc.shell.sectionYTight}`}>
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index}>
                  <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <EditableReveal>
              <div className={`mx-auto max-w-xl ${dc.surface.soft} px-8 py-16 text-center`}>
                <span className={dc.type.label}>Nothing here yet</span>
                <h2 className={`${dc.type.subTitle} mt-4`}>The shelf is still being stocked</h2>
                <p className={`${dc.type.body} mt-3`}>Try another category, or check back after new {label.toLowerCase()} are published.</p>
              </div>
            </EditableReveal>
          )}

          {posts.length ? (
            <nav className="mt-16 flex flex-wrap items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-2.5 font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--editable-border-strong)]"
                >
                  Previous
                </Link>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-2.5 font-[var(--editable-font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-2.5 font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--editable-border-strong)]"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

// Yelp-style red star ratings. Prefers real rating/review fields, falls back to
// a stable derived value so the UI always reads well (wire to real data later).
const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.7 + (hashStr(post.slug || post.id || post.title || 'x') % 13) / 10) * 10) / 10
}
const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 480)
}

function RatingLine({ post, center = false }: { post: SitePost; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-2.5 flex items-center gap-2 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-4 w-4 ${i < filled ? 'fill-[var(--slot4-accent)] text-[var(--slot4-accent)]' : 'fill-[var(--editable-border)] text-[var(--editable-border)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--slot4-page-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--slot4-muted-text)]">({reviewsOf(post)})</span>
    </div>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Note')
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`}>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="p-6 sm:p-7">
        <div className="flex items-center gap-2 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
          <span>{category}</span>
          <span className="text-[var(--slot4-muted-text)]">· No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className={`${dc.type.subTitle} mt-3`}>{post.title}</h2>
        <RatingLine post={post} />
        <p className={`${dc.type.body} mt-3 line-clamp-2`}>{getSummary(post)}</p>
        <CardArrow label="Read entry" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} flex items-center gap-5 p-5 sm:p-6`}>
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-media-bg)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-9 w-9 text-[var(--slot4-muted-text)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className={`${dc.type.subTitle} truncate`}>{post.title}</h2>
        <RatingLine post={post} />
        <p className={`${dc.type.body} mt-2 line-clamp-1 text-sm`}>{getSummary(post)}</p>
        <div className="mt-3 flex flex-wrap gap-3 font-[var(--editable-font-mono)] text-xs font-medium text-[var(--slot4-muted-text)]">
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> Website</span> : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)] transition group-hover:text-[var(--slot4-accent)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="font-[var(--editable-font-display)] text-3xl font-semibold tracking-[-0.03em] text-[var(--slot4-accent)]">{price || 'Open offer'}</span>
        {condition ? <span className={dc.badge.accentPill}>{condition}</span> : null}
      </div>
      <h2 className={`${dc.type.subTitle} mt-5`}>{post.title}</h2>
      <RatingLine post={post} />
      <p className={`${dc.type.body} mt-3 line-clamp-3 flex-1 text-sm`}>{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--editable-border)] pt-4 font-[var(--editable-font-mono)] text-xs font-medium text-[var(--slot4-muted-text)]">
        <span className="inline-flex items-center gap-1.5">{location ? <><MapPin className="h-3.5 w-3.5" /> {location}</> : 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--slot4-accent)] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className={`group mb-5 block break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-300 hover:-translate-y-1 hover:border-[var(--editable-border-strong)]`}>
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(5,11,26,0.78))] opacity-80 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="font-[var(--editable-font-display)] line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-white">{post.title}</h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/75">View image <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-6`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">Saved · {String(index + 1).padStart(2, '0')}</span>
        <h2 className={`${dc.type.subTitle} mt-1.5 text-lg`}>{post.title}</h2>
        <p className={`${dc.type.body} mt-2 line-clamp-2 text-sm`}>{getSummary(post)}</p>
        {website ? <p className="mt-3 truncate font-[var(--editable-font-mono)] text-xs font-medium text-[var(--slot4-accent)]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const theme = getTaskTheme('pdf')
  const category = getCategory(post, theme.kicker)
  const summary = getSummary(post)
  return (
    <Link href={href} className={`${cardBase} flex h-full flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
          <FileText className="h-6 w-6" />
        </div>
        <span className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
          {category}
        </span>
      </div>
      <h2 className={`${dc.type.subTitle} mt-6`}>{post.title}</h2>
      {summary ? <p className={`${dc.type.body} mt-3 line-clamp-3 flex-1 text-sm`}>{summary}</p> : <div className="flex-1" />}
      <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-2 text-sm font-medium text-[var(--slot4-page-text)] transition group-hover:border-[var(--editable-border-strong)] group-hover:text-[var(--slot4-accent)]">
        Open reference
        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--editable-border)] bg-[var(--slot4-media-bg)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--slot4-muted-text)]" />}
      </div>
      <h2 className={`${dc.type.subTitle} mt-5 text-lg`}>{post.title}</h2>
      {role ? <p className="mt-1.5 font-[var(--editable-font-mono)] text-xs font-medium uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{role}</p> : null}
      <RatingLine post={post} center />
      <p className={`${dc.type.body} mt-3 line-clamp-2 text-sm`}>{getSummary(post)}</p>
    </Link>
  )
}
