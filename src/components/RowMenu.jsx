import { useState } from 'react'
import { MoreIcon, ChevronDownIcon } from './icons.jsx'

/**
 * RowMenu — a "more actions" menu for a table row. Every item inside is
 * clearly labelled (no cryptic icon-only actions). Click stops row
 * selection/open.
 *
 * variant="kebab" (default) — a quiet three-dot trigger, for secondary,
 * rarely-used actions.
 * variant="chevron" — a bordered dropdown trigger that reads as "more options
 * for the button beside it", for rows where the hidden items (e.g. Share with
 * manager, Reject) are primary alternatives, not an unlabeled overflow menu.
 */
export default function RowMenu({ items = [], className = '', variant = 'kebab' }) {
  const [open, setOpen] = useState(false)
  if (items.length === 0) return null
  const isChevron = variant === 'chevron'
  return (
    <span className={`relative ${className}`}>
      <button
        type="button"
        aria-label="More actions"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className={
          isChevron
            ? 'flex h-[34px] w-[34px] items-center justify-center rounded-md border border-hairline bg-surface text-secondary shadow-card transition-colors hover:border-accent hover:text-ink'
            : 'flex h-7 w-7 items-center justify-center rounded-md text-secondary transition-colors hover:bg-ink/[0.06] hover:text-ink'
        }
      >
        {isChevron ? <ChevronDownIcon className="h-4 w-4" /> : <MoreIcon className="h-4 w-4" />}
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
