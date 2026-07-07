import { useState } from 'react'
import { MoreIcon } from './icons.jsx'

/**
 * RowMenu — a quiet "more actions" menu for a table row. The trigger is a
 * standard three-dot affordance; every item inside is clearly labelled (no
 * cryptic icon-only actions). Click stops row selection/open.
 */
export default function RowMenu({ items = [], className = '' }) {
  const [open, setOpen] = useState(false)
  if (items.length === 0) return null
  return (
    <span className={`relative ${className}`}>
      <button
        type="button"
        aria-label="More actions"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="flex h-7 w-7 items-center justify-center rounded-md text-secondary transition-colors hover:bg-ink/[0.06] hover:text-ink"
      >
        <MoreIcon className="h-4 w-4" />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 z-50 mt-1 w-48 overflow-hidden rounded-md border border-hairline bg-surface p-1 shadow-dropdown">
            {items.map((it) => (
              <button
                key={it.label}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(false)
                  it.onClick()
                }}
                className={`flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-background ${
                  it.tone === 'danger' ? 'text-danger' : 'text-ink'
                }`}
              >
                {it.icon}
                {it.label}
              </button>
            ))}
          </div>
        </>
      )}
    </span>
  )
}
