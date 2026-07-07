import { ChevronRightIcon } from './icons.jsx'

/**
 * PageHeader — the reference's top-of-screen pattern: a small grey breadcrumb, a
 * large bold title, and a one-line grey subtitle carrying live counts (numbers
 * bold in ink), with an optional cluster of actions on the right.
 */
export default function PageHeader({ breadcrumb, title, stats, subtitle, actions, className = '' }) {
  const crumbs = Array.isArray(breadcrumb) ? breadcrumb : breadcrumb ? [breadcrumb] : []
  return (
    <div className={`flex flex-wrap items-start justify-between gap-x-6 gap-y-4 ${className}`}>
      <div className="min-w-0">
        {crumbs.length > 0 && (
          <nav className="mb-2 flex items-center gap-1 text-[13px] text-secondary" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={c} className="inline-flex items-center gap-1">
                {i > 0 && <ChevronRightIcon className="h-3.5 w-3.5 text-muted" />}
                <span className={i === crumbs.length - 1 ? 'font-medium text-ink' : ''}>{c}</span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-[28px] font-bold leading-tight text-ink">{title}</h1>
        {stats ? <HeaderStats items={stats} /> : subtitle && <p className="mt-2 text-sm text-secondary">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

/**
 * HeaderStats — the grey subtitle with live counts, e.g.
 * "18 matched · 6 invited · 2 taken forward". Numbers read bold in ink; the
 * words and separators stay calm grey.
 */
export function HeaderStats({ items = [], className = '' }) {
  const shown = items.filter((it) => it && it.n != null)
  return (
    <p className={`mt-2 flex flex-wrap items-center text-sm text-secondary ${className}`}>
      {shown.map((it, i) => (
        <span key={it.label} className="inline-flex items-center">
          {i > 0 && <span className="mx-1.5 text-muted">·</span>}
          <span className="font-semibold text-ink tabular-nums">{it.n}</span>
          <span className="ml-1">{it.label}</span>
        </span>
      ))}
    </p>
  )
}
