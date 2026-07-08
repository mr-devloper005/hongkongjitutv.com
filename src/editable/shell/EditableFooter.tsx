'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  const pdfRoute = SITE_CONFIG.tasks.find((t) => t.key === 'pdf')?.route || '/pdf'
  const description = globalContent.footer?.description || SITE_CONFIG.description
  const brandName =
    SITE_CONFIG.name.trim() ||
    globalContent.site?.name?.trim() ||
    SITE_CONFIG.domain

  const eyebrow =
    'font-[var(--editable-font-mono)] text-sm font-semibold uppercase tracking-[0.14em] text-[var(--editable-footer-text)]'
  const linkClass =
    'inline-flex items-center gap-1.5 text-sm font-medium text-white/75 transition hover:text-white'

  const accountLinks: Array<{ label: string; href: string }> = session
    ? [{ label: 'Submit', href: '/create' }]
    : [
        { label: 'Sign in', href: '/login' },
        { label: 'Get started', href: '/signup' },
      ]

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-12">
        <div>
          <Link href="/" className="inline-flex max-w-full items-center gap-3 text-[var(--editable-footer-text)]">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/[0.08] ring-1 ring-white/15">
              <img src="/favicon.png?v=20260413" alt={brandName} className="h-10 w-10 object-contain" />
            </span>
            <span className="min-w-0 break-words font-[var(--editable-font-display)] text-xl font-semibold leading-tight text-[var(--editable-footer-text)]">
              {brandName}
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-[1.7] text-white/65">{description}</p>
        </div>

        <div>
          <p className={eyebrow}>Discover</p>
          <div className="mt-5 grid gap-3">
            <Link href={pdfRoute} className={linkClass}>
              Reference Library <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div>
          <p className={eyebrow}>Resources</p>
          <div className="mt-5 grid gap-3">
            <Link href="/about" className={linkClass}>
              About
            </Link>
            <Link href="/contact" className={linkClass}>
              Contact
            </Link>
            <Link href="/search" className={linkClass}>
              Search
            </Link>
          </div>
        </div>

        <div>
          <p className={eyebrow}>Account</p>
          <div className="mt-5 grid gap-3">
            {accountLinks.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}
            {session ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 text-left text-sm font-medium text-white/75 transition hover:text-white"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col gap-2 px-6 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>
            © {year} {brandName}. All rights reserved.
          </span>
          <span className="font-[var(--editable-font-mono)] uppercase tracking-[0.18em]">
            Reference Library
          </span>
        </div>
      </div>
    </footer>
  )
}
