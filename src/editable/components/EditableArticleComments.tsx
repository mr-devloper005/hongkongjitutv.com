'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'

type Comment = { id: string; name: string; comment: string; createdAt: string }

const storageKey = (slug: string) => `editable:article-comments:${slug}`

function timeAgo(value?: string) {
  if (!value) return ''
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(1, Math.floor((Date.now() - then) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return new Date(then).toLocaleDateString()
}

function initial(name: string) {
  return (name.trim()[0] || 'G').toUpperCase()
}

const inputClass = 'w-full rounded-[12px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)] focus:ring-2 focus:ring-[var(--slot4-accent-soft)]'

export function EditableArticleComments({ slug, comments = [] }: { slug: string; comments?: Comment[] }) {
  const [stored, setStored] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug))
      setStored(raw ? (JSON.parse(raw) as Comment[]) : [])
    } catch {
      setStored([])
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setStored(next)
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
    } catch {
      /* storage unavailable — keep the in-memory list */
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    const entry: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Guest',
      comment: body,
      createdAt: new Date().toISOString(),
    }
    persist([entry, ...stored])
    setText('')
  }

  const all = useMemo(() => [...stored, ...comments], [stored, comments])

  return (
    <section className="mt-16 border-t border-[var(--editable-border)] pt-12">
      <p className="inline-flex items-center gap-2 font-[var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">Reader responses · {all.length}</p>
      <h3 className="font-[var(--editable-font-display)] mt-4 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-[30px]">Reader responses</h3>

      <form onSubmit={submit} className="mt-8 rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className={inputClass}
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Share your thoughts…"
          rows={4}
          maxLength={1500}
          className={`${inputClass} mt-3 resize-y leading-6`}
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[color-mix(in_oklab,var(--slot4-dark-bg)_86%,white)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Post comment
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-4">
        {all.map((comment) => (
          <div key={comment.id} className="rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-sm font-semibold text-[var(--slot4-accent)]">
                {initial(comment.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--slot4-page-text)]">{comment.name || 'Guest'}</p>
                {comment.createdAt ? <p className="font-[var(--editable-font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--slot4-soft-muted-text)]">{timeAgo(comment.createdAt)}</p> : null}
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-[1.6] text-[var(--slot4-muted-text)]">{comment.comment}</p>
          </div>
        ))}
        {!all.length ? <p className="text-sm text-[var(--slot4-muted-text)]">Be the first to respond.</p> : null}
      </div>
    </section>
  )
}
