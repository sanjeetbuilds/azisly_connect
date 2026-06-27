import Button from './Button.jsx'
import Avatar from './Avatar.jsx'

/* Minimal line icons — stroke = currentColor, so they inherit ink/secondary.
   No colour of their own. */
const icons = {
  Pipeline: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-4 w-4">
      <rect x="2" y="3" width="3.2" height="10" rx="1" />
      <rect x="6.4" y="3" width="3.2" height="6.5" rx="1" />
      <rect x="10.8" y="3" width="3.2" height="8.5" rx="1" />
    </svg>
  ),
  Candidates: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-4 w-4">
      <circle cx="8" cy="5.5" r="2.4" />
      <path d="M3.4 13c0-2.4 2-4 4.6-4s4.6 1.6 4.6 4" strokeLinecap="round" />
    </svg>
  ),
  Roles: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-4 w-4">
      <rect x="2.3" y="5" width="11.4" height="7.7" rx="1.5" />
      <path d="M6 5V4a1.6 1.6 0 0 1 1.6-1.6h0.8A1.6 1.6 0 0 1 10 4v1" strokeLinecap="round" />
    </svg>
  ),
}

const NAV_GROUPS = [{ label: 'Main', items: ['Pipeline', 'Candidates', 'Roles'] }]

/**
 * Sidebar — the app shell's left column (Prysm/Linear style).
 * Logo at the top, grouped nav, the primary "New role" action, and the
 * recruiter identity pinned to the bottom. A single hairline divides it from
 * the main content.
 */
export default function Sidebar({ active = 'Candidates', onNavigate, workspace, className = '' }) {
  return (
    <aside
      className={`sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-hairline bg-background lg:flex ${className}`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-hairline px-5">
        <span className="font-medium tracking-tight text-ink">
          Azisly <span className="text-secondary">Recruit</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <span className="px-2.5 pb-2 text-xs text-secondary">{group.label}</span>
            {group.items.map((item) => {
              const isActive = item === active
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onNavigate?.(item)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-ink/[0.05] text-ink'
                      : 'text-secondary hover:bg-ink/[0.03] hover:text-ink'
                  }`}
                >
                  {icons[item]}
                  {item}
                </button>
              )
            })}
          </div>
        ))}

        <div className="px-1.5 pt-1">
          <Button variant="primary" className="w-full">
            New role
          </Button>
        </div>
      </nav>

      {/* Workspace / recruiter identity */}
      {workspace && (
        <div className="border-t border-hairline px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Avatar src={workspace.avatar} name={workspace.name} size={32} />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm text-ink">{workspace.name}</span>
              <span className="truncate text-xs text-secondary">{workspace.role}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
