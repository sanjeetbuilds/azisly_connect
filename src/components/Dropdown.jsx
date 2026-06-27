import { useState } from 'react'
import { ChevronDownIcon, CheckIcon } from './icons.jsx'

/**
 * Dropdown — a working filter control. Shows its label (e.g. "Stage") and, once
 * a non-default option is picked, the chosen value with an accent-tinted border.
 * Click-away closes it.
 */
export default function Dropdown({ label, value, options, onChange, className = '' }) {
  const [open, setOpen] = useState(false)
  const current = options.find((o) => o.value === value)
  const active = value && value !== 'all'

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-lg border bg-surface px-3 py-2 text-sm shadow-card transition-colors ${
          active ? 'border-accent/40 text-ink' : 'border-hairline text-secondary hover:text-ink'
        }`}
      >
        <span className={active ? 'text-secondary' : ''}>{label}</span>
        {active && <span className="font-medium text-ink">{current?.label}</span>}
        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div
            role="listbox"
            className="absolute left-0 z-40 mt-1.5 min-w-[180px] rounded-lg border border-hairline bg-surface p-1 shadow-dropdown"
          >
            {options.map((o) => {
              const selected = o.value === value
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-background ${
                    selected ? 'text-ink' : 'text-secondary'
                  }`}
                >
                  {o.label}
                  {selected && <CheckIcon className="h-3.5 w-3.5 text-accent" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
