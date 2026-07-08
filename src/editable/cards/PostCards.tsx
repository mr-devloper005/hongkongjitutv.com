import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured entry' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link
      href={href}
      className={`group relative block min-w-0 overflow-hidden rounded-[24px] ${pal.darkBg} ${pal.darkText} transition duration-300 hover:-translate-y-1`}
    >
      <div className="relative min-h-[520px] p-6 sm:p-8 lg:min-h-[620px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,26,0.25),rgba(5,11,26,0.88))]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className="inline-flex items-center gap-2 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-white/75">
            {label}
          </span>
          <h3 className="mt-5 max-w-3xl font-[var(--editable-font-display)] text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl font-[var(--editable-font-body)] text-[15px] leading-[1.65] text-white/75 sm:text-base">
            {getEditableExcerpt(post, 190)}
          </p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 font-[var(--editable-font-body)] text-sm font-medium text-[var(--slot4-dark-bg)] transition duration-200 group-hover:bg-white/90">
            Open reference <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}
    >
      <div className={`${dc.media.frame} ${dc.media.ratio} rounded-b-none border-b border-[var(--editable-border)]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[var(--slot4-dark-bg)]/85 px-3 py-1 font-[var(--editable-font-mono)] text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-5">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{getEditableCategory(post)}</p>
        <h3 className={`mt-3 line-clamp-3 font-[var(--editable-font-display)] text-xl font-semibold leading-[1.15] tracking-[-0.02em] ${pal.panelText}`}>
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-3 font-[var(--editable-font-body)] text-sm leading-[1.6] ${pal.mutedText}`}>
          {getEditableExcerpt(post, 135)}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 font-[var(--editable-font-body)] text-xs font-medium text-[var(--slot4-page-text)] transition duration-200 group-hover:text-[var(--slot4-accent)]">
          Open <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group block min-w-0 rounded-[20px] border border-[var(--editable-border)] ${pal.surfaceBg} p-5 ${dc.motion.lift}`}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] font-[var(--editable-font-mono)] text-xs font-medium tracking-[0.02em] text-[var(--slot4-page-text)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-accent)]">
            <Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}
          </p>
          <h3 className={`mt-2 line-clamp-2 font-[var(--editable-font-display)] text-lg font-semibold leading-[1.2] tracking-[-0.02em] ${pal.panelText}`}>
            {post.title}
          </h3>
          <p className={`mt-2 line-clamp-2 font-[var(--editable-font-body)] text-sm leading-[1.55] ${pal.mutedText}`}>
            {getEditableExcerpt(post, 105)}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-5 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[220px_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[190px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>
          Entry {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}
        </p>
        <h2 className={`mt-3 line-clamp-3 font-[var(--editable-font-display)] text-2xl font-semibold leading-[1.1] tracking-[-0.025em] ${pal.panelText} sm:text-3xl`}>
          {post.title}
        </h2>
        <p className={`mt-4 line-clamp-3 font-[var(--editable-font-body)] text-sm leading-[1.65] ${pal.mutedText}`}>
          {getEditableExcerpt(post, 180)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-[var(--editable-font-body)] text-sm font-medium text-[var(--slot4-page-text)] transition duration-200 group-hover:text-[var(--slot4-accent)]">
          Open reference <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
