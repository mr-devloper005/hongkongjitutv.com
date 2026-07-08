import Link from 'next/link'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-16 sm:pt-20 lg:pt-24`}>
        <EditableReveal>
          <p className={dc.type.eyebrow}>{voice.eyebrow}</p>
          <h1 className={`${dc.type.heroTitle} mt-5 max-w-4xl`}>{voice.headline}</h1>
          <p className={`${dc.type.bodyLg} mt-6 max-w-3xl`}>{voice.description}</p>
        </EditableReveal>

        <EditableReveal index={1} className="mt-10">
          <form action={basePath} className={`${dc.surface.card} flex flex-col gap-3 p-5 sm:flex-row`}>
            <select name="category" defaultValue={category || 'all'} className={`min-w-0 flex-1 ${dc.surface.input}`}>
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className={dc.button.primary}>Filter <ArrowRight className="h-4 w-4" /></button>
          </form>
        </EditableReveal>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <EditableReveal key={post.id} index={index}>
                <ArticleListCard post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />
              </EditableReveal>
            ))}
          </div>
        ) : (
          <div className={`${dc.surface.soft} p-10 text-center`}>
            <p className={dc.type.eyebrow}>Nothing here yet</p>
            <h2 className={`${dc.type.sectionTitle} mt-4`}>No entries found</h2>
            <p className={`${dc.type.body} mt-4`}>Try another category or return to the full library.</p>
          </div>
        )}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className={dc.button.secondary}>Previous</Link> : null}
          <span className="inline-flex items-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className={dc.button.secondary}>Next <ArrowRight className="h-4 w-4" /></Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-14 sm:pt-16 lg:pt-20`}>
        <EditableReveal>
          <Link href="/article" className={`${dc.button.secondary} mb-8`}><ChevronLeft className="h-4 w-4" /> Back to library</Link>
          <p className={dc.type.eyebrow}>{voice.eyebrow}</p>
          <h1 className={`${dc.type.heroTitle} mt-5 max-w-4xl`}>{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
        </EditableReveal>
      </section>
      <section className={`${dc.shell.section} pb-20`}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <EditableReveal>
            <div className={`${dc.surface.card} p-8 lg:p-10`}>
              <p className={`${dc.type.body}`}>{post?.summary || `Entry content for ${slug} will render through the editable detail page.`}</p>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <aside className={`${dc.surface.dark} p-8`}>
              <p className={`${dc.type.eyebrow} ${pal.accentSoftText}`}>Reading note</p>
              <p className="mt-4 text-sm leading-[1.6] text-white/72">{voice.secondaryNote}</p>
              <Link href="/contact" className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium ${pal.panelText}`}>Contact <ArrowRight className="h-4 w-4" /></Link>
            </aside>
          </EditableReveal>
        </div>
      </section>
    </main>
  )
}
