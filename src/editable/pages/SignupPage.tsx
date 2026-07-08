import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className={dc.shell.page}>
        <section className={`${dc.shell.section} flex min-h-[calc(100vh-12rem)] items-center py-16 sm:py-20 lg:py-24`}>
          <EditableReveal className="mx-auto w-full max-w-xl">
            <div className="text-center">
              <p className={dc.type.eyebrow}>{pagesContent.auth.signup.badge}</p>
              <h1 className={`${dc.type.heroTitle} mt-5`}>{pagesContent.auth.signup.title}</h1>
              <p className={`${dc.type.body} mt-6`}>{pagesContent.auth.signup.description}</p>
            </div>
            <div className={`${dc.surface.card} mt-10 p-8 sm:p-10`}>
              <p className={dc.type.eyebrow}>{pagesContent.auth.signup.formTitle}</p>
              <EditableLocalSignupForm />
              <p className={`${dc.type.body} mt-6 text-sm`}>Already have an account? <Link href="/login" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
