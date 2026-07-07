import { useState } from 'react'
import { Button, Card } from '../components'
import { SearchIcon, CheckIcon, PlusIcon, MinusIcon } from '../components/icons.jsx'

const ROLE_SUGGESTIONS = [
  'Senior Product Engineer',
  'Product Engineer',
  'Staff Software Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'Platform Engineer',
  'Infrastructure Engineer',
  'Engineering Manager',
  'Product Designer',
  'Product Manager',
  'Data Engineer',
  'Designer',
]

function FieldLabel({ children, hint }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <span className="text-sm font-medium text-ink">{children}</span>
      {hint && <span className="text-xs text-secondary">{hint}</span>}
    </div>
  )
}

/**
 * CreateRoleScreen — the first, deliberately small step. The recruiter names the
 * role and sets the number of openings, and that is all. By default the
 * recruiter defines the role themselves on the next screen; asking a hiring
 * manager to define it is an optional action offered there, not an up-front
 * setting. There is no "who defines / who decides" matrix here anymore.
 */
export default function CreateRoleScreen({ onCancel, onContinue }) {
  const [query, setQuery] = useState('')
  const [chosen, setChosen] = useState(null) // a role is only "chosen" when picked from the list
  const [open, setOpen] = useState(false)
  const [openings, setOpenings] = useState(1)

  const q = query.trim().toLowerCase()
  const matches = q.length >= 2 ? ROLE_SUGGESTIONS.filter((r) => r.toLowerCase().includes(q)) : []
  const showSuggestions = open && q.length >= 2 && !chosen
  const valid = Boolean(chosen) && openings >= 1

  const handleType = (v) => {
    setQuery(v)
    setChosen(null) // editing invalidates any prior choice, must re-pick
    setOpen(true)
  }
  const choose = (r) => {
    setChosen(r)
    setQuery(r)
    setOpen(false)
  }

  const submit = () => {
    if (!valid) return
    onContinue({ title: chosen, openings })
  }

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Mobile-only header */}
      <header className="flex h-14 shrink-0 items-center border-b border-hairline px-5 lg:hidden">
        <span className="font-medium tracking-tight text-ink">
          Azisly <span className="text-secondary">Recruit</span>
        </span>
      </header>

      {/* Page header */}
      <div className="shrink-0 px-6 pt-8 lg:px-8">
        <p className="text-[13px] font-medium text-secondary">Roles · New</p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight text-ink">Create a role</h1>
        <p className="mt-2 text-sm text-secondary">
          Name the role and set how many openings. You will define it on the next step.
        </p>
      </div>

      {/* Scrollable form */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-6 lg:px-8">
        <div className="mx-auto w-full max-w-xl">
          <Card className="flex flex-col gap-8 p-8">
            {/* Role title */}
            <div>
              <FieldLabel hint="Start typing to see suggestions">Role title</FieldLabel>
              <div className="relative">
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3 text-secondary">
                    <SearchIcon className="h-4 w-4" />
                  </span>
                  <input
                    value={query}
                    onChange={(e) => handleType(e.target.value)}
                    onFocus={() => setOpen(true)}
                    placeholder="e.g. Senior Product Engineer"
                    className={`w-full rounded-lg border bg-surface py-2.5 pl-9 pr-9 text-sm text-ink shadow-card transition-colors placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/15 ${
                      chosen ? 'border-accent' : 'border-hairline focus:border-accent'
                    }`}
                  />
                  {chosen && (
                    <span className="absolute right-3 text-accent">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                </div>

                {showSuggestions && (
                  <>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => setOpen(false)}
                      className="fixed inset-0 z-30 cursor-default"
                    />
                    <div className="absolute left-0 right-0 z-40 mt-1.5 overflow-hidden rounded-lg border border-hairline bg-surface p-1 shadow-dropdown">
                      {matches.length > 0 ? (
                        matches.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => choose(m)}
                            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-background"
                          >
                            <SearchIcon className="h-3.5 w-3.5 text-secondary" />
                            {m}
                          </button>
                        ))
                      ) : (
                        <button
                          type="button"
                          onClick={() => choose(query.trim())}
                          className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-background"
                        >
                          Use &ldquo;<span className="font-medium">{query.trim()}</span>&rdquo;
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
              {query && !chosen && (
                <p className="mt-2 text-xs text-secondary">Choose a role from the list to continue.</p>
              )}
            </div>

            {/* Openings */}
            <div>
              <FieldLabel>Number of openings</FieldLabel>
              <div className="inline-flex items-center overflow-hidden rounded-lg border border-hairline shadow-card">
                <button
                  type="button"
                  onClick={() => setOpenings((num) => Math.max(1, num - 1))}
                  disabled={openings <= 1}
                  aria-label="Decrease"
                  className="flex h-9 w-10 items-center justify-center text-secondary transition-colors hover:text-ink disabled:opacity-40"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="w-12 border-x border-hairline py-2 text-center font-mono text-sm text-ink tabular-nums">
                  {openings}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenings((num) => Math.min(99, num + 1))}
                  aria-label="Increase"
                  className="flex h-9 w-10 items-center justify-center text-secondary transition-colors hover:text-ink"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="rounded-lg border border-hairline bg-background px-4 py-3 text-[13px] leading-relaxed text-secondary">
              You will define this role yourself next. Prefer a hiring manager to define it? You can
              hand it over with a link from the define screen.
            </p>
          </Card>
        </div>
      </div>

      {/* Sticky action bar — one clear primary action */}
      <div className="shrink-0 border-t border-hairline bg-background px-6 py-4 lg:px-8">
        <div className="mx-auto flex w-full max-w-xl items-center justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={!valid} onClick={submit}>
            Continue to define
          </Button>
        </div>
      </div>
    </div>
  )
}
