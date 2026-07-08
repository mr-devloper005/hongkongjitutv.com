import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, Phone, Star, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const derivedPages = (post: SitePost) => {
  const raw = Number(getContent(post).pages)
  if (raw > 0) return `${Math.floor(raw)}`
  const body = stripHtml(getBody(post))
  return `${Math.max(1, Math.ceil(body.length / 500))}`
}

const derivedSize = (post: SitePost) => {
  const raw = asText(getContent(post).fileSize) || asText(getContent(post).size)
  if (raw) return raw
  try {
    return formatBytes(JSON.stringify(post).length)
  } catch {
    return '—'
  }
}

const derivedSections = (post: SitePost): string[] => {
  const content = getContent(post)
  const raw = content.sections
  if (Array.isArray(raw)) {
    const items = raw.map((item) => typeof item === 'string' ? item : asText((item as Record<string, unknown>)?.title)).filter(Boolean) as string[]
    if (items.length) return items.slice(0, 6)
  }
  const body = stripHtml(getBody(post))
  const sentences = body.split(/[.!?]\s+/).filter((s) => s.length > 10 && s.length < 90)
  return sentences.slice(0, 4)
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className={`min-h-screen ${pal.pageBg} ${pal.pageText}`}>
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

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

function DetailMeta({ post, category, center = false }: { post: SitePost; category?: string; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-[18px] w-[18px] ${i < filled ? 'fill-[var(--tk-accent)] text-[var(--tk-accent)]' : 'fill-[var(--tk-line)] text-[var(--tk-line)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--tk-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">{reviewsOf(post)} reviews</span>
      {category ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-50" />
          <span className="text-sm text-[var(--tk-muted)]">{category}</span>
        </>
      ) : null}
    </div>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-50" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  if (task === 'profile') {
    return (
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
    )
  }
  if (task === 'pdf') {
    return (
      <Link href={getTaskConfig('pdf')?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
        <ArrowLeft className="h-4 w-4" /> Back to {getTaskTheme('pdf').kicker}
      </Link>
    )
  }
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

// ----- Article: a quiet, centred reading column -----
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
        <BackLink task="article" />
        <p className="mt-10 text-xs font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">{categoryOf(post, 'Article')}</p>
        <h1 className="editable-display mt-5 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">{post.title}</h1>
        <div className="mt-6 text-sm text-[var(--tk-muted)]">
          <span>{SITE_CONFIG.name}</span>
        </div>
        {images[0] ? <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

// ----- Listing: a precise directory record -----
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-8">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="min-w-0">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-12 w-12 text-[var(--slot4-muted-text)]" />}
            </div>
            <div className="min-w-0">
              <Kicker task="listing">Business listing</Kicker>
              <h1 className="editable-display mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
              <DetailMeta post={post} category={getField(post, ['category'])} />
            </div>
          </div>
          {leadText(post) ? <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">{leadText(post)}</p> : null}
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <Divider />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Showcase" />
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" post={post} related={related} />
        </aside>
      </div>
    </section>
  )
}

// ----- Classified: price-forward notice with a sticky action rail -----
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-6 py-14 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className={`mt-7 p-7 ${dc.surface.card} ${pal.shadow}`}>
            <Kicker task="classified">Classified</Kicker>
            <h1 className="editable-display mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em]">{post.title}</h1>
            <DetailMeta post={post} category={getField(post, ['category'])} />
            <p className="editable-display mt-6 text-4xl font-semibold tracking-[-0.03em] text-[var(--slot4-accent)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className={dc.button.accent}><Phone className="h-4 w-4" /> Call now</a> : null}
              {email ? <a href={`mailto:${email}`} className={dc.button.secondary}><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

// ----- Image: a dark, gallery-led canvas -----
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-8">
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className={dc.badge.pill}><Camera className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> Image story</div>
            <h1 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--slot4-muted-text)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

// ----- Bookmark: a single curated resource -----
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]"><Bookmark className="h-7 w-7" /></div>
        <div className="mt-6"><Kicker task="sbm">Saved resource</Kicker></div>
        <h1 className="editable-display mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
        {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--slot4-muted-text)]">{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className={`mt-8 ${dc.button.accent}`}>
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

// ----- Reference document (public library detail page) -----
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const theme = getTaskTheme('pdf')
  const category = categoryOf(post, 'General')
  const pages = derivedPages(post)
  const size = derivedSize(post)
  const sections = derivedSections(post)
  const filename = `${(post.slug || 'reference').replace(/[^a-z0-9-]+/gi, '-')}.ref`
  const author = post.authorName || asText(getContent(post).author) || SITE_CONFIG.name
  const brandName = SITE_CONFIG.name.trim() || SITE_CONFIG.domain
  const lead = leadText(post)
  const tags = Array.isArray(post.tags) ? post.tags.slice(0, 6) : []
  const bottomAdSize = pickRandom(getSlotSizes('article-bottom'))
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-12">
        <BackLink task="pdf" />

        <EditableReveal>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className={dc.badge.accentPill}>{theme.kicker}</span>
            <span className={dc.badge.pill}>REF</span>
            <span className={dc.badge.pill}>{category}</span>
          </div>
        </EditableReveal>

        <EditableReveal index={1}>
          <h1 className="editable-display mt-8 max-w-5xl text-balance font-[var(--editable-font-display)] text-[52px] font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-[64px] lg:text-[82px]">
            {post.title}
          </h1>
        </EditableReveal>

        {lead ? (
          <EditableReveal index={2}>
            <p className="mt-10 max-w-3xl border-l-2 border-[var(--slot4-accent)] pl-6 text-[22px] font-medium leading-[1.5] text-[var(--slot4-page-text)] sm:text-[26px]">
              {lead}
            </p>
          </EditableReveal>
        ) : null}

        <EditableReveal index={3}>
          <div className="mt-10 flex flex-wrap gap-3">
            {fileUrl ? (
              <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.primary}>
                <Download className="h-4 w-4" /> Download reference
              </Link>
            ) : null}
            {fileUrl ? (
              <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.secondary}>
                Open in new tab <ExternalLink className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </EditableReveal>

        <EditableReveal index={4}>
          <div className="mt-10 flex flex-wrap gap-2">
            <span className={dc.badge.pill}>Pages · {pages}</span>
            <span className={dc.badge.pill}>Size · {size}</span>
            <span className={dc.badge.pill}>Format · REF</span>
            <span className={dc.badge.pill}>Category · {category}</span>
          </div>
        </EditableReveal>

        {fileUrl ? (
          <EditableReveal index={5}>
            <div className="mt-14 overflow-hidden rounded-[24px] border border-[var(--slot4-page-text)]/10 bg-[var(--slot4-panel-bg)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--editable-border)] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]"><FileText className="h-4 w-4" /></span>
                  <span className="font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">Live preview</span>
                </div>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.ghost}>
                  Open in new tab <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                title={post.title}
                className="h-[78vh] w-full bg-[var(--slot4-panel-bg)]"
              />
            </div>
          </EditableReveal>
        ) : null}

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <EditableReveal>
              <h2 className={dc.type.sectionTitle}>About this reference</h2>
            </EditableReveal>
            <EditableReveal index={1}>
              <BodyContent post={post} />
            </EditableReveal>

            {tags.length ? (
              <EditableReveal index={2}>
                <div className="mt-10 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className={dc.badge.pill}>{t}</span>
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            {fileUrl ? (
              <EditableReveal index={3}>
                <div className={`mt-14 flex flex-col gap-5 p-8 sm:flex-row sm:items-center sm:justify-between ${dc.surface.dark}`}>
                  <div>
                    <p className="font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">Take it offline</p>
                    <p className="mt-2 text-sm font-semibold text-white/80">{brandName}</p>
                    <p className="mt-2 font-[var(--editable-font-display)] text-2xl font-semibold text-white sm:text-3xl">
                      Take the reference offline.
                    </p>
                  </div>
                  <Link
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[var(--slot4-accent-hover)]"
                  >
                    <Download className="h-4 w-4" /> Download reference
                  </Link>
                </div>
              </EditableReveal>
            ) : null}

            <EditableReveal index={4}>
              <div className="mt-16">
                <Ads slot="article-bottom" size={bottomAdSize} showLabel />
              </div>
            </EditableReveal>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <EditableReveal>
              <div className={`p-7 ${dc.surface.card} ${pal.shadow}`}>
                <div className="flex items-center justify-center">
                  <div className="flex h-[120px] w-[100px] items-center justify-center rounded-[16px] bg-[var(--slot4-accent-soft)] font-[var(--editable-font-display)] text-[96px] font-semibold leading-none tracking-[-0.05em] text-[var(--slot4-accent)]">
                    R
                  </div>
                </div>
                <p className="mt-6 truncate text-center font-[var(--editable-font-mono)] text-[12px] font-medium tracking-[0.06em] text-[var(--slot4-page-text)]">
                  {filename}
                </p>
                <dl className="mt-6 divide-y divide-[var(--editable-border)] text-sm">
                  <SidebarRow label="Category" value={category} />
                  <SidebarRow label="Pages" value={pages} />
                  <SidebarRow label="Size" value={size} />
                  <SidebarRow label="Contributor" value={author} />
                </dl>
                {fileUrl ? (
                  <Link
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-6 w-full ${dc.button.primary}`}
                  >
                    <Download className="h-4 w-4" /> Download
                  </Link>
                ) : null}
              </div>
            </EditableReveal>

            {sections.length ? (
              <EditableReveal index={1}>
                <div className={`p-7 ${dc.surface.soft}`}>
                  <p className="font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
                    What&apos;s inside
                  </p>
                  <ul className="mt-4 space-y-3">
                    {sections.map((s, idx) => (
                      <li key={idx} className="flex gap-3 text-sm leading-6 text-[var(--slot4-page-text)]">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--slot4-accent)]" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </EditableReveal>
            ) : null}
          </aside>
        </div>
      </section>

      <PdfRelatedStrip related={related} />
    </>
  )
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <dt className="font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{label}</dt>
      <dd className="max-w-[60%] truncate text-right text-sm font-medium text-[var(--slot4-page-text)]">{value}</dd>
    </div>
  )
}

function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig('pdf')
  return (
    <section className={`border-t border-[var(--editable-border)] ${pal.panelBg}`}>
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:py-20 lg:px-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className={dc.type.label}>More references</p>
            <h2 className={`mt-3 ${dc.type.sectionTitle}`}>Explore the collection</h2>
          </div>
          <Link href={taskConfig?.route || '/'} className={dc.button.ghost}>
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => (
            <EditableReveal key={item.id || item.slug} index={i}>
              <Link
                href={`${taskConfig?.route || '/pdf'}/${item.slug}`}
                className={`group flex h-full flex-col gap-5 p-6 ${dc.surface.card} ${dc.motion.lift}`}
              >
                <div className="flex h-[120px] items-center justify-center rounded-[14px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                  <FileText className="h-10 w-10" />
                </div>
                <div className="min-w-0">
                  <h3 className="editable-display line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)]">{item.title}</h3>
                  <p className="mt-3 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">
                    REF · {categoryOf(item, 'General')}
                  </p>
                </div>
              </Link>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ----- Contributor (direct-URL only) -----
function ProfileDetail({ post, related: _related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'company'])
  const location = getField(post, ['location', 'address', 'city'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  const mapSrc = mapSrcFor(post)
  const lead = leadText(post)
  const tags = Array.isArray(post.tags) ? post.tags.slice(0, 8) : []
  const verified = Boolean(getContent(post).verified) || true
  const sidebarAdSize = pickRandom(getSlotSizes('sidebar'))

  const contactHref = email ? `mailto:${email}` : website ? website : phone ? `tel:${phone}` : '#'

  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-12">
      <BackLink task="profile" />

      <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          {/* Hero */}
          <EditableReveal>
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
              <div className="flex h-[144px] w-[144px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] shadow-[0_20px_48px_-24px_rgba(5,11,26,0.35)] sm:h-[160px] sm:w-[160px]">
                {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 text-[var(--slot4-muted-text)]" />}
              </div>
              <div className="min-w-0 flex-1">
                <span className={dc.badge.accentPill}>{getTaskTheme('profile').kicker}</span>
                <h1 className="editable-display mt-4 text-balance font-[var(--editable-font-display)] text-5xl font-semibold leading-[1.02] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[68px]">
                  {post.title}
                </h1>
                {role ? <p className="mt-4 text-lg text-[var(--slot4-muted-text)]">{role}</p> : null}
              </div>
            </div>
          </EditableReveal>

          {lead ? (
            <EditableReveal index={1}>
              <p className="mt-10 max-w-3xl border-l-2 border-[var(--slot4-accent)] pl-6 text-[20px] font-medium leading-[1.55] text-[var(--slot4-page-text)] sm:text-[22px]">
                {lead}
              </p>
            </EditableReveal>
          ) : null}

          {/* Quick facts strip */}
          <EditableReveal index={2}>
            <div className="mt-10 flex flex-wrap gap-2">
              {location ? <span className={dc.badge.pill}><MapPin className="h-3 w-3 text-[var(--slot4-accent)]" /> {location}</span> : null}
              {role ? <span className={dc.badge.pill}><Building2 className="h-3 w-3 text-[var(--slot4-accent)]" /> {role}</span> : null}
              {website ? <span className={dc.badge.pill}><Globe2 className="h-3 w-3 text-[var(--slot4-accent)]" /> Website</span> : null}
              {verified ? <span className={dc.badge.accentPill}><CheckCircle2 className="h-3 w-3" /> Verified</span> : null}
            </div>
          </EditableReveal>

          {/* Body */}
          <EditableReveal index={3}>
            <h2 className={`mt-16 ${dc.type.sectionTitle}`}>About this contributor</h2>
          </EditableReveal>
          <EditableReveal index={4}>
            <BodyContent post={post} />
          </EditableReveal>

          {tags.length ? (
            <EditableReveal index={5}>
              <div className="mt-10 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className={dc.badge.pill}>{t}</span>
                ))}
              </div>
            </EditableReveal>
          ) : null}

          {(address || (lat && lng)) && mapSrc ? (
            <EditableReveal index={6}>
              <div className="mt-14 overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
                <MapBox src={mapSrc} label={address || post.title} />
              </div>
            </EditableReveal>
          ) : null}

          {/* Explore the library CTA */}
          <EditableReveal index={7}>
            <div className={`mt-16 flex flex-col gap-5 p-8 sm:flex-row sm:items-center sm:justify-between ${dc.surface.dark}`}>
              <div>
                <p className="font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">Reference Library</p>
                <p className="mt-2 font-[var(--editable-font-display)] text-2xl font-semibold text-white sm:text-3xl">Explore the collection</p>
              </div>
              <Link
                href={getTaskConfig('pdf')?.route || '/pdf'}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[var(--slot4-accent-hover)]"
              >
                Browse references <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>
        </div>

        {/* Sticky sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <EditableReveal>
            <div className={`p-7 ${dc.surface.card} ${pal.shadow}`}>
              <p className={dc.type.label}>Contact</p>
              <ul className="mt-5 space-y-2">
                {address ? (
                  <li>
                    <span className="flex items-start gap-3 rounded-[12px] px-3 py-2.5 text-sm text-[var(--slot4-page-text)]">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                      <span className="min-w-0 break-words">{address}</span>
                    </span>
                  </li>
                ) : null}
                {phone ? (
                  <li>
                    <a href={`tel:${phone}`} className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-panel-bg)]">
                      <Phone className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                      <span className="min-w-0 truncate">{phone}</span>
                    </a>
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a href={`mailto:${email}`} className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-panel-bg)]">
                      <Mail className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                      <span className="min-w-0 truncate">{email}</span>
                    </a>
                  </li>
                ) : null}
                {website ? (
                  <li>
                    <a href={website} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-panel-bg)]">
                      <Globe2 className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                      <span className="min-w-0 truncate">{website}</span>
                    </a>
                  </li>
                ) : null}
              </ul>
              <Link
                href={contactHref}
                target={email || contactHref === '#' ? undefined : '_blank'}
                rel={contactHref === '#' ? undefined : 'noreferrer'}
                className={`mt-6 w-full ${dc.button.primary}`}
              >
                <Mail className="h-4 w-4" /> Contact contributor
              </Link>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div className={`p-7 ${dc.surface.soft}`}>
              <p className={dc.type.label}>Trust</p>
              <ul className="mt-5 space-y-3.5 text-sm text-[var(--slot4-page-text)]">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent)]" /> Verified identity</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent)]" /> Direct contact</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent)]" /> Public references</li>
              </ul>
            </div>
          </EditableReveal>

          <EditableReveal index={2}>
            <Ads slot="sidebar" size={sidebarAdSize} showLabel />
          </EditableReveal>
        </aside>
      </div>
    </section>
  )
}

// ----- Shared building blocks -----
function Divider() {
  return <div className="my-10 h-px bg-[var(--editable-border)]" />
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--slot4-page-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className={`p-4 ${dc.surface.card}`}>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]"><Icon className="h-4 w-4 text-[var(--slot4-accent)]" /> {label}</div>
          <p className="mt-2 break-words text-sm font-medium leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className={dc.type.label}>{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[20px] border border-[var(--editable-border)] object-cover" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold"><MapPin className="h-4 w-4 text-[var(--slot4-accent)]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? <Link href={website} target="_blank" rel="noreferrer" className={dc.button.accent}>Website <ExternalLink className="h-4 w-4" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className={dc.button.secondary}><Phone className="h-4 w-4" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className={dc.button.secondary}><Mail className="h-4 w-4" /> Email</a> : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className={`p-6 ${dc.surface.card}`}>
      <p className={dc.type.label}>Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-4 py-3 text-sm">
      <span className="font-medium uppercase tracking-[0.12em] text-[var(--slot4-muted-text)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, post: _post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="space-y-6">
      <div className={`p-6 ${dc.surface.card}`}>
        <p className={dc.type.label}>About this post</p>
        <div className="mt-4 grid gap-2.5 text-sm text-[var(--slot4-muted-text)]">
          <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--slot4-accent)]" /> {taskConfig?.label || task}</p>
          <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent)]" /> {SITE_CONFIG.name}</p>
        </div>
      </div>
      {related.length ? (
        <div className={`p-6 ${dc.surface.card}`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="editable-display text-lg font-semibold tracking-[-0.02em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--slot4-accent)]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--editable-border)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-16 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-2xl font-semibold tracking-[-0.02em]">More {(taskConfig?.label || 'posts').toLowerCase()}</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} grid />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className={`group block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
        <div className="aspect-[16/10] overflow-hidden bg-[var(--slot4-panel-bg)]">
          {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--slot4-muted-text)]" /></div>}
        </div>
        <div className="p-5">
          <h3 className="editable-display line-clamp-2 text-base font-semibold leading-snug tracking-[-0.01em]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-xl border border-[var(--editable-border)] p-3 transition hover:border-[var(--slot4-page-text)]">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--slot4-panel-bg)]"><FileText className="h-5 w-5 text-[var(--slot4-muted-text)]" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.01em]">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--slot4-muted-text)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
