import { cn } from '@/lib/utils'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-[20px] bg-[var(--slot4-panel-bg)]', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div className={cn(dc.shell.container, 'py-16 sm:py-20', className)} aria-live="polite" aria-busy="true">
      <p className={dc.type.eyebrow}>{label}</p>
      <PulseBlock className="mt-6 h-14 w-3/4 max-w-3xl" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className={cn(dc.surface.card, 'p-5')}>
            <PulseBlock className="h-44 w-full" />
            <PulseBlock className="mt-5 h-5 w-4/5" />
            <PulseBlock className="mt-3 h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={cn(dc.surface.card, 'p-5')}>
          <PulseBlock className="h-40 w-full" />
          <PulseBlock className="mt-5 h-5 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
          <PulseBlock className="mt-6 h-10 w-36 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading entry', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr]', className)} aria-live="polite" aria-busy="true">
      <PulseBlock className="h-80 w-full" />
      <div>
        <p className={dc.type.eyebrow}>{label}</p>
        <PulseBlock className="mt-6 h-14 w-4/5" />
        <PulseBlock className="mt-5 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-3 h-4 w-2/3" />
      </div>
    </div>
  )
}
