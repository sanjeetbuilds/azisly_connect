/**
 * Tabs — the reference's list tabs: a label with a small count, the active one
 * marked by ink text and a green underline. Sits on a hairline baseline.
 */
export default function Tabs({ tabs, value, onChange, className = '' }) {
  return (
    <div className={`flex items-center gap-6 border-b border-hairline ${className}`}>
      {tabs.map((t) => {
        const active = t.key === value
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`-mb-px flex items-center gap-2 border-b-2 pb-3 pt-1 text-sm transition-colors ${
              active
                ? 'border-accent-strong font-semibold text-ink'
                : 'border-transparent font-medium text-secondary hover:text-ink'
            }`}
          >
            {t.label}
            {t.count != null && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                  active ? 'bg-accent-soft text-strong' : 'bg-ink/[0.05] text-secondary'
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
