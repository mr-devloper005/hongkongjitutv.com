'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const brandName =
    SITE_CONFIG.name.trim() ||
    globalContent.site?.name?.trim() ||
    SITE_CONFIG.domain

  const configuredLinks = globalContent.nav?.primaryLinks
  const primaryLinks: Array<{ label: string; href: string }> = [
    {
      label: configuredLinks?.find((l) => l.href === '/about')?.label || 'About',
      href: '/about',
    },
    {
      label: configuredLinks?.find((l) => l.href === '/contact')?.label || 'Contact',
      href: '/contact',
    },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] backdrop-blur-md">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-6 px-6 sm:px-8 lg:px-12">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] transition group-hover:bg-[var(--slot4-accent)]">
            <img src="/favicon.png?v=20260413" alt={brandName} className="h-10 w-10 object-contain" />
          </span>
          <span className="editable-display text-lg font-semibold leading-none tracking-[-0.01em] text-[var(--slot4-page-text)]">
            {brandName}
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {primaryLinks.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'text-[var(--slot4-accent)]'
                    : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition hover:border-[var(--editable-border-strong)] hover:text-[var(--slot4-accent)] sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-[var(--slot4-accent-hover)] sm:inline-flex"
              >
                Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition duration-200 hover:border-[var(--slot4-page-text)] sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition duration-200 hover:border-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-[color-mix(in_oklab,var(--slot4-dark-bg)_86%,white)] sm:inline-flex"
              >
                Get started
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <div className="h-px bg-[var(--editable-border)]" />

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-6 py-6 lg:hidden">
          <div className="grid gap-1">
            {primaryLinks.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-full px-4 py-3 text-sm font-medium transition ${
                    active
                      ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
                      : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]"
            >
              <Search className="h-4 w-4" /> Search
            </Link>
            <div className="mt-3 grid gap-2">
              {session ? (
                <>
                  <Link
                    href="/create"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--slot4-accent-hover)]"
                  >
                    Submit
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)]"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[color-mix(in_oklab,var(--slot4-dark-bg)_86%,white)]"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
