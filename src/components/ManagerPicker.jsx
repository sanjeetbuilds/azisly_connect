import { useState } from 'react'
import Avatar from './Avatar.jsx'
import { SearchIcon, XIcon, PlusIcon } from './icons.jsx'
import { previousManagers as SEED } from '../data/managers.js'

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const inputCls =
  'w-full rounded-lg border border-hairline bg-surface px-3 py-2.5 text-sm text-ink shadow-card transition-colors placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15'

const Label = ({ children }) => <span className="mb-2 block text-sm font-medium text-ink">{children}</span>

/**
 * ManagerPicker — one combined control to pick a hiring manager. Type to filter
 * previously-added managers; with no match, add a new one inline. The selection
 * becomes a single chip (name + email) with a clear way to change it. No stacked
 * boxes, no separate "previously added" card wall.
 */
export default function ManagerPicker({ value, onChange }) {
  const [managers, setManagers] = useState(SEED)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const q = query.trim().toLowerCase()
  const matches = q
    ? managers.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
    : managers
  const exact = managers.some((m) => m.name.toLowerCase() === q || m.email.toLowerCase() === q)

  const reset = () => {
    setQuery('')
    setOpen(false)
    setAdding(false)
  }
  const select = (m) => {
    onChange?.(m)
    reset()
  }
  const startAdd = () => {
    setNewName(query.trim())
    setNewEmail('')
    setAdding(true)
  }
  const confirmAdd = () => {
    if (!isEmail(newEmail)) return
    const m = {
      id: `m-${managers.length + 1}`,
      name: newName.trim() || newEmail.trim(),
      email: newEmail.trim(),
    }
    setManagers((prev) => [m, ...prev])
    select(m)
  }

  // Filled — a single chip with a way to change it.
  if (value) {
    return (
      <div>
        <Label>Hiring manager</Label>
        <div className="flex items-center gap-3 rounded-lg border border-accent/40 bg-accent/[0.03] px-3 py-2 shadow-card ring-1 ring-accent/15">
          <Avatar name={value.name} size={30} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-ink">{value.name}</span>
            <span className="block truncate text-[13px] text-secondary">{value.email}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              onChange?.(null)
              setOpen(true)
            }}
            aria-label="Change hiring manager"
            title="Change"
            className="shrink-0 rounded-md p-1.5 text-secondary transition-colors hover:bg-ink/[0.05] hover:text-ink"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Label>Hiring manager</Label>
      <div className="relative">
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-3 text-secondary">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
              setAdding(false)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search a name or add new"
            className={`${inputCls} pl-9`}
          />
        </div>

        {open && (
          <>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={reset}
              className="fixed inset-0 z-30 cursor-default"
            />
            <div className="absolute left-0 right-0 z-40 mt-1.5 overflow-hidden rounded-lg border border-hairline bg-surface p-1 shadow-dropdown">
              {adding ? (
                <div className="flex flex-col gap-2 p-2">
                  <p className="text-[13px] font-medium text-ink">Add a new hiring manager</p>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Full name"
                    className={inputCls}
                  />
                  <input
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && confirmAdd()}
                    type="email"
                    placeholder="name@company.com"
                    className={inputCls}
                  />
                  <div className="flex items-center justify-end gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setAdding(false)}
                      className="rounded-md px-2.5 py-1.5 text-[13px] font-medium text-secondary transition-colors hover:text-ink"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!isEmail(newEmail)}
                      onClick={confirmAdd}
                      className="rounded-md bg-ink px-2.5 py-1.5 text-[13px] font-medium text-surface transition-colors hover:bg-ink-hover disabled:opacity-40"
                    >
                      Add manager
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {matches.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => select(m)}
                      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-background"
                    >
                      <Avatar name={m.name} size={26} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">{m.name}</span>
                        <span className="block truncate text-[13px] text-secondary">{m.email}</span>
                      </span>
                    </button>
                  ))}
                  {q && !exact && (
                    <button
                      type="button"
                      onClick={startAdd}
                      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-background"
                    >
                      <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-hairline text-secondary">
                        <PlusIcon className="h-3.5 w-3.5" />
                      </span>
                      Add “<span className="font-medium">{query.trim()}</span>” as new
                    </button>
                  )}
                  {matches.length === 0 && !q && (
                    <p className="px-2.5 py-2 text-[13px] text-secondary">
                      Type a name to find or add a hiring manager.
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
