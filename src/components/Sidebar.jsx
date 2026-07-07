import Button from './Button.jsx'
import Avatar from './Avatar.jsx'
import { ChevronDownIcon } from './icons.jsx'

/* Minimal line icons — stroke = currentColor, so they inherit the item colour. */
const icons = {
  Pipeline: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-[18px] w-[18px]">
      <rect x="2" y="3" width="3.2" height="10" rx="1" />
      <rect x="6.4" y="3" width="3.2" height="6.5" rx="1" />
      <rect x="10.8" y="3" width="3.2" height="8.5" rx="1" />
    </svg>
  ),
  Candidates: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-[18px] w-[18px]">
      <circle cx="8" cy="5.5" r="2.4" />
      <path d="M3.4 13c0-2.4 2-4 4.6-4s4.6 1.6 4.6 4" strokeLinecap="round" />
    </svg>
  ),
  Roles: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-[18px] w-[18px]">
      <rect x="2.3" y="5" width="11.4" height="7.7" rx="1.5" />
      <path d="M6 5V4a1.6 1.6 0 0 1 1.6-1.6h0.8A1.6 1.6 0 0 1 10 4v1" strokeLinecap="round" />
    </svg>
  ),
}

const NAV_GROUPS = [{ label: 'Recruiting', items: ['Roles', 'Candidates'] }]

/**
 * Sidebar — the app shell's left rail in the reference style: a branded logo
 * tile at the top, grouped nav with tiny uppercase section labels, each item an
 * icon + label + optional count badge, the active item on a soft green pill with
 * a green left bar, the primary "New role" action, and the recruiter identity
 * pinned to the bottom.
 */
export default function Sidebar({
  active = 'Candidates',
  onNavigate,
  onNewRole,
  workspace,
  counts = {},
  className = '',
}) {
  return (
    <aside
      className={`sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-hairline bg-sidebar lg:flex ${className}`}
    >
      {/* Logo / workspace */}
      <div className="flex h-16 items-center gap-3 border-b border-hairline px-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-[15px] font-bold text-white">
          A
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink">Azisly Recruit</div>
          <div className="truncate text-xs text-secondary">{workspace?.role ?? 'Recruiting'}</div>
        </div>
        <ChevronDownIcon className="h-4 w-4 text-muted" />
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {group.label}
            </span>
            {group.items.map((item) => {
              const isActive = item === active
              const count = counts[item]
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onNavigate?.(item)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-accent-soft font-semibold text-strong'
                      : 'font-medium text-secondary hover:bg-ink/[0.03] hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent-dot" aria-hidden="true" />
                  )}
                  {icons[item]}
                  <span className="flex-1">{item}</span>
                  {count != null && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                        isActive ? 'text-strong' : 'text-muted'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}

        <div className="px-1.5 pt-1">
          <Button variant="primary" className="w-full" onClick={onNewRole}>
            New role
          </Button>
        </div>
      </nav>

      {/* Recruiter identity */}
      {workspace && (
        <div className="border-t border-hairline px-3 py-3">
          <div className="flex items-center gap-3 rounded-lg px-1.5 py-1.5">
            <Avatar name={workspace.name} size={34} />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-ink">{workspace.name}</span>
              <span className="truncate text-xs text-secondary">{workspace.role}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
