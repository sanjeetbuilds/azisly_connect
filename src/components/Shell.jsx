import Avatar from './Avatar.jsx'
import Button from './Button.jsx'
import { ChevronDownIcon } from './icons.jsx'
import { workspace, candidates } from '../data/candidates.js'
import { seedRoles } from '../data/roles.js'

// The app shell — neutral. A fuller left rail (account switcher, RECRUITING
// group, Roles / Candidates with counts, a New role button, the signed-in user
// pinned to the bottom), a top bar, and a non-scrolling content area. The active
// nav item is a filled neutral pill, not a coloured rail. No colour anywhere.

const NAV = [
  {
    key: 'Roles',
    count: seedRoles.length,
    icon: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px]">
        <rect x="2.5" y="5.5" width="13" height="9" rx="1.5" />
        <path d="M6.5 5.5V4.4A1.4 1.4 0 0 1 7.9 3h2.2a1.4 1.4 0 0 1 1.4 1.4v1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'Candidates',
    count: candidates.length,
    icon: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px]">
        <circle cx="9" cy="6.2" r="2.6" />
        <path d="M3.8 14.5c0-2.7 2.3-4.4 5.2-4.4s5.2 1.7 5.2 4.4" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function Shell({ active = 'Roles', breadcrumb, title, action, onNavigate, onNewRole, children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-ink">
      {/* Left rail. */}
      <aside className="hidden h-screen w-60 shrink-0 flex-col border-r-[0.5px] border-hairline bg-surface lg:flex">
        {/* Account switcher. */}
        <button
          type="button"
          className="flex h-[60px] shrink-0 items-center gap-2.5 border-b-[0.5px] border-hairline px-3 text-left transition-colors hover:bg-ink/[0.02]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink text-[13px] font-semibold text-white">
            A
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-ink">Azisly Recruit</div>
            <div className="truncate text-[12px] text-secondary">Recruiting · Acme</div>
          </div>
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted" />
        </button>

        {/* Nav. */}
        <nav className="flex flex-1 flex-col overflow-y-auto p-3">
          <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-medium uppercase text-muted">Recruiting</p>
          <div className="flex flex-col gap-0.5">
            {NAV.map(({ key, count, icon }) => {
              const isActive = key === active
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onNavigate?.(key)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[14px] transition-colors ${
                    isActive ? 'bg-ink/[0.05] font-medium text-ink' : 'text-secondary hover:bg-ink/[0.03] hover:text-ink'
                  }`}
                >
                  {icon}
                  <span className="flex-1">{key}</span>
                  <span className="text-[12px] tabular-nums text-muted">{count}</span>
                </button>
              )
            })}
          </div>
          <div className="px-0.5 pt-3">
            <Button
              variant="secondary"
              onClick={onNewRole}
              className="w-full !border-ink !bg-ink !text-white hover:!bg-ink-hover"
            >
              New role
            </Button>
          </div>
        </nav>

        {/* Signed-in user. */}
        <div className="shrink-0 border-t-[0.5px] border-hairline p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-1 py-1">
            <Avatar name={workspace.name} size={32} />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-ink">{workspace.name}</div>
              <div className="truncate text-[12px] text-secondary">{workspace.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column. */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — 60px, 0.5px bottom border. */}
        <div className="flex h-[60px] shrink-0 items-center justify-between gap-4 border-b-[0.5px] border-hairline bg-surface px-6">
          <div className="min-w-0">
            {breadcrumb && <p className="text-[12px] leading-tight text-muted">{breadcrumb}</p>}
            {title && <p className="truncate text-[15px] font-semibold leading-tight text-ink">{title}</p>}
          </div>
          {action}
        </div>

        {/* Content — the page itself does not scroll; columns scroll. */}
        <div className="relative min-h-0 flex-1 overflow-hidden bg-background p-6">{children}</div>
      </div>
    </div>
  )
}
