/**
 * Nav — minimal top bar. A wordmark on the left, quiet links on the right,
 * separated from the page by a single hairline. No shadow, no fill weight.
 */
export default function Nav({
  items = [],
  active,
  action,
  className = '',
}) {
  return (
    <header
      className={`sticky top-0 z-20 border-b border-hairline bg-background/80 backdrop-blur-sm ${className}`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2 no-underline">
          <span className="font-medium tracking-tight text-ink">
            Azisly <span className="text-secondary">Recruit</span>
          </span>
        </a>

        <div className="flex items-center gap-6">
          {items.length > 0 && (
            <nav className="hidden items-center gap-6 sm:flex">
              {items.map((item) => {
                const isActive = item === active
                return (
                  <a
                    key={item}
                    href="#"
                    className={`text-sm no-underline transition-colors hover:text-ink ${
                      isActive ? 'text-ink' : 'text-secondary'
                    }`}
                  >
                    {item}
                  </a>
                )
              })}
            </nav>
          )}
          {action}
        </div>
      </div>
    </header>
  )
}
