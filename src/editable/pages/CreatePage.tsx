'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const publicTasks = enabledTasks.filter((item) => item.key !== 'profile')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className={dc.shell.page}>
          <section className={`${dc.shell.section} flex min-h-[calc(100vh-12rem)] items-center py-16 sm:py-20 lg:py-24`}>
            <EditableReveal className="mx-auto w-full max-w-xl text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <Lock className="h-6 w-6" />
              </span>
              <p className={`${dc.type.eyebrow} mt-6`}>{pagesContent.create.locked.badge}</p>
              <h1 className={`${dc.type.heroTitle} mt-5`}>{pagesContent.create.locked.title}</h1>
              <p className={`${dc.type.body} mt-6`}>{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/login" className={dc.button.primary}>Sign in <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className={dc.button.secondary}>Create account</Link>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className={dc.shell.page}>
        <section className={`${dc.shell.section} pt-16 sm:pt-20 lg:pt-24`}>
          <EditableReveal className="mx-auto max-w-3xl text-center">
            <p className={dc.type.eyebrow}>{pagesContent.create.hero.badge}</p>
            <h1 className={`${dc.type.heroTitle} mt-5`}>{pagesContent.create.hero.title}</h1>
            <p className={`${dc.type.bodyLg} mt-6`}>{pagesContent.create.hero.description}</p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} ${dc.shell.sectionYTight}`}>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <EditableReveal>
              <aside className={`${dc.surface.soft} p-8`}>
                <p className={dc.type.eyebrow}>Entry type</p>
                <p className={`${dc.type.body} mt-4`}>Choose which kind of entry you want to add to the library.</p>
                <div className="mt-6 grid gap-3">
                  {publicTasks.map((item) => {
                    const Icon = taskIcon[item.key] || FileText
                    const active = item.key === task
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setTask(item.key)}
                        className={`flex items-start gap-3 rounded-[16px] border p-4 text-left transition ${active ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-dark-bg)] text-white' : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] hover:border-[var(--editable-border-strong)]'}`}
                      >
                        <Icon className="mt-0.5 h-5 w-5" />
                        <span className="flex-1">
                          <span className="block text-sm font-semibold">{item.label}</span>
                          <span className={`mt-1 block text-xs ${active ? 'text-white/70' : 'text-[var(--slot4-muted-text)]'}`}>{item.description}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </aside>
            </EditableReveal>

            <EditableReveal index={1}>
              <form onSubmit={submit} className={`${dc.surface.card} p-8 lg:p-10`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className={dc.type.eyebrow}>Submit {activeTask?.label || 'entry'}</p>
                    <h2 className={`${dc.type.subTitle} mt-3`}>{pagesContent.create.formTitle}</h2>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-4 py-2 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{session.name}</span>
                </div>

                <div className="mt-8 grid gap-4">
                  <input className={dc.surface.input} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Entry title" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={dc.surface.input} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                    <input className={dc.surface.input} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Source URL" />
                  </div>
                  <input className={dc.surface.input} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                  <textarea className={`${dc.surface.input} min-h-[6rem]`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                  <textarea className={`${dc.surface.input} min-h-[12rem]`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, citation notes, or description" required />
                </div>

                {created ? (
                  <div className="mt-6 flex items-start gap-3 rounded-[12px] border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{pagesContent.create.successTitle}</p>
                      <p className="mt-1 text-sm opacity-80">{created.title}</p>
                    </div>
                  </div>
                ) : null}

                <button type="submit" className={`${dc.button.primary} mt-8 w-full`}>
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
