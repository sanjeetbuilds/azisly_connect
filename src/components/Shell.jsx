// The app shell — neutral. A 240px surface sidebar, a 60px top bar, and a
// surface-0 content area with 24px padding. No colour anywhere: the active nav
// item is a filled neutral pill, not a coloured rail. The only coloured element
// on the define screen is the microphone (rendered inside `children`).

const NAV = [
  {
    key: 'Roles',
    icon: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px]">
        <rect x="2.5" y="5.5" width="13" height="9" rx="1.5" />
        <path d="M6.5 5.5V4.4A1.4 1.4 0 0 1 7.9 3h2.2a1.4 1.4 0 0 1 1.4 1.4v1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'Candidates',
    icon: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px]">
        <circle cx="9" cy="6.2" r="2.6" />
        <path d="M3.8 14.5c0-2.7 2.3-4.4 5.2-4.4s5.2 1.7 5.2 4.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'Settings',
    icon: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px]">
        <circle cx="9" cy="9" r="2.4" />
        <path d="M9 2.2v1.6M9 14.2v1.6M2.2 9h1.6M14.2 9h1.6M4.2 4.2l1.1 1.1M12.7 12.7l1.1 1.1M13.8 4.2l-1.1 1.1M5.3 12.7l-1.1 1.1" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function Shell({ active = 'Roles', company = 'Azisly Recruit', breadcrumb, title, action, onNavigate, children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-ink">
      {/* Sidebar — 240px, surface-2, full height. */}
      <aside className="hidden h-screen w-60 shrink-0 flex-col border-r-[0.5px] border-hairline bg-surface lg:flex">
        <div className="flex h-[60px] shrink-0 items-center gap-2.5 border-b-[0.5px] border-hairline px-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ink text-[13px] font-semibold text-white">
            A
          </span>
          <span className="truncate text-sm font-semibold text-ink">{company}</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map(({ key, icon }) => {
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
                <span>{key}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main column. */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — 60px, surface-2, 0.5px bottom border. */}
        <div className="flex h-[60px] shrink-0 items-center justify-between gap-4 border-b-[0.5px] border-hairline bg-surface px-6">
          <div className="min-w-0">
            {breadcrumb && <p className="text-[12px] leading-tight text-muted">{breadcrumb}</p>}
            {title && <p className="truncate text-[15px] font-semibold leading-tight text-ink">{title}</p>}
          </div>
          {action}
        </div>

        {/* Content — surface-0, 24px padding. */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-background p-6">{children}</div>
      </div>
    </div>
  )
}
