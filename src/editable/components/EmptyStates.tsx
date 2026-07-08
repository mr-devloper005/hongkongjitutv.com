import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing here yet',
  description = 'Fresh entries will appear here automatically once this section has published content.',
  actionLabel = 'Back to library',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn(dc.surface.card, 'px-8 py-12 text-center', className)}>
      <p className={dc.type.eyebrow}>Nothing here yet</p>
      <h2 className={`${dc.type.sectionTitle} mx-auto mt-5 max-w-xl`}>{title}</h2>
      <p className={`${dc.type.body} mx-auto mt-5 max-w-xl`}>{description}</p>
      <Link href={actionHref} className={`${dc.button.primary} mt-8`}>
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically. The layout stays ready even when the feed is empty.`}
      actionLabel="Back to library"
      actionHref="/pdf"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
