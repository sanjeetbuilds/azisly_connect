import { ListIcon, GridIcon } from './icons.jsx'

/**
 * ViewToggle — a segmented list/grid switch. The active segment uses the
 * functional accent so the current view reads at a glance.
 */
const OPTIONS = [
  { key: 'list', label: 'List view', Icon: ListIcon },
  { key: 'grid', label: 'Grid view', Icon: GridIcon },
]

export default function ViewToggle({ value, onChange, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-0.5 rounded-lg border border-hairline bg-surface p-0.5 shadow-card ${className}`}>
      {OPTIONS.map(({ key, label, Icon }) => {
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-label={label}
            aria-pressed={active}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
              active ? 'bg-accent/10 text-accent' : 'text-secondary hover:text-ink'
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        )
      })}
    </div>
  )
}
