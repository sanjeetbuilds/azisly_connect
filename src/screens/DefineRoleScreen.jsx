import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../components'
import {
  ArrowLeftIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
  MoreIcon,
  PaperclipIcon,
  MicIcon,
  SendIcon,
} from '../components/icons.jsx'
import { roleCriteria, REUSE_POOL, translateConcern, competencyMeaning } from '../data/scorecard.js'

const GROUPS = [
  { key: 'essential', label: 'Essential', purpose: 'Everyone we put forward must have this.' },
  { key: 'veryImportant', label: 'Very important', purpose: 'We weigh this heavily.' },
  { key: 'nice', label: 'Nice to have', purpose: 'A plus, not a filter.' },
]
const GROUP_LABEL = Object.fromEntries(GROUPS.map((g) => [g.key, g.label]))
const WORD = { 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven' }
const word = (n) => WORD[n] ?? String(n)

let nextId = 3000

// Turn a typed or spoken phrase into a criterion, in recruiter language.
function criterionFromPhrase(text) {
  const t = text.trim()
  if (t.length < 3) return null
  if (/stakeholder|cross-?functional|align/i.test(t))
    return { name: 'Stakeholder Management', desc: 'Keeps the people around the work aligned and moving.', comp: 'Communication', importance: 'veryImportant' }
  if (/remote|distributed|time ?zone|async/i.test(t))
    return { name: 'Working Remotely', desc: 'Stays effective and visible without an office.', comp: 'Collaboration', importance: 'veryImportant' }
  if (/mentor|coach|grow|junior/i.test(t))
    return { name: 'Mentoring', desc: 'Helps the people around them get better.', comp: 'Collaboration', importance: 'nice' }
  if (/data|metric|number|analytic/i.test(t))
    return { name: 'Data Literacy', desc: 'Comfortable reading numbers and drawing a conclusion.', comp: 'Learning Agility', importance: 'veryImportant' }
  const mapped = translateConcern(t)
  if (mapped) return { name: mapped.primary, desc: competencyMeaning(mapped.primary), comp: mapped.primary, importance: 'veryImportant' }
  return null
}

/* Per-card menu. Renders in a portal above everything, so it is never clipped by
   or hidden behind another card. Click to open, not hover. */
function CardMenu({ importance, onMove, onEdit, onRemove }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const btnRef = useRef(null)

  const toggle = () => {
    if (open) {
      setOpen(false)
      return
    }
    const r = btnRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + 6, right: Math.max(8, window.innerWidth - r.right) })
    setOpen(true)
  }
  const close = () => setOpen(false)
  const run = (fn) => () => {
    close()
    fn()
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label="Criterion menu"
        aria-haspopup="menu"
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
          open ? 'bg-background text-ink' : 'text-muted hover:bg-background hover:text-ink'
        }`}
      >
        <MoreIcon className="h-4 w-4" />
      </button>
      {open &&
        createPortal(
          <>
            <button type="button" aria-hidden="true" tabIndex={-1} onClick={close} className="fixed inset-0 z-[100] cursor-default" />
            <div
              role="menu"
              className="fixed z-[101] w-52 overflow-hidden rounded-lg border border-hairline bg-surface p-1 shadow-dropdown"
              style={{ top: pos.top, right: pos.right }}
            >
              {GROUPS.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={run(() => onMove(g.key))}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-background"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                    {importance === g.key && <CheckIcon className="h-3.5 w-3.5 text-strong" />}
                  </span>
                  Move to {g.label}
                </button>
              ))}
              <div className="my-1 h-px bg-hairline" />
              <button
                type="button"
                onClick={run(onEdit)}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-background"
              >
                <span className="h-4 w-4 shrink-0" /> Edit
              </button>
              <button
                type="button"
                onClick={run(onRemove)}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-danger transition-colors hover:bg-danger-soft/60"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  <XIcon className="h-3.5 w-3.5" />
                </span>
                Remove
              </button>
            </div>
          </>,
          document.body,
        )}
    </>
  )
}

/* One criterion card. No rail, no dot. Essential cards get a very slightly
   stronger border, nothing more. Highlights briefly when the composer changes it. */
function CriterionCard({ item, essential, highlighted, editing, name, desc, setName, setDesc, onMove, onEdit, onRemove, onSave, onCancel }) {
  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-card border border-accent bg-surface p-4 shadow-card">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="w-full rounded-md border border-hairline bg-surface px-2.5 py-1.5 text-sm font-semibold text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-md border border-hairline bg-surface px-2.5 py-1.5 text-[13px] leading-relaxed text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
        />
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onCancel} className="text-[13px] font-medium text-secondary hover:text-ink">
            Cancel
          </button>
          <button type="button" onClick={onSave} className="text-[13px] font-medium text-strong hover:underline">
            Save
          </button>
        </div>
      </div>
    )
  }
  return (
    <div
      className={`flex animate-fade-in-up items-start justify-between gap-2 rounded-card border bg-surface p-4 shadow-card transition-shadow duration-500 ${
        essential ? 'border-ink/20' : 'border-hairline'
      } ${highlighted ? 'ring-2 ring-accent' : 'ring-0'}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{item.name}</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-secondary">{item.desc}</p>
      </div>
      <CardMenu importance={item.importance} onMove={onMove} onEdit={onEdit} onRemove={onRemove} />
    </div>
  )
}

/**
 * DefineRoleScreen — the criteria that matter for the role, in a two-column
 * composition: a quiet left margin naming each importance group, a wide right
 * column of criteria as a 2-up grid. No rails, no dots. A composer bar at the
 * bottom lets the recruiter type, speak, or drop a JD to enrich the card; it is
 * optional. A hiring manager on a magic link sees this identical screen.
 */
export default function DefineRoleScreen({
  roleTitle = 'New role',
  openings = 1,
  onBack,
  onComplete,
  onAskManager,
  reviewLabel = 'Looks good, continue',
}) {
  const [criteria, setCriteria] = useState(() => roleCriteria(roleTitle))
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [highlightIds, setHighlightIds] = useState(() => new Set())
  const [panel, setPanel] = useState(null) // add | reuse | null
  const [composer, setComposer] = useState('')
  const [changeSummary, setChangeSummary] = useState(null) // { text, snapshot }

  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newGroup, setNewGroup] = useState('veryImportant')

  const flash = (ids) => {
    setHighlightIds(new Set(ids))
    setTimeout(() => setHighlightIds(new Set()), 1800)
  }

  const moveTo = (id, importance) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, importance } : c)))
    flash([id])
  }
  const remove = (id) => setCriteria((prev) => prev.filter((c) => c.id !== id))
  const hasName = (n) => criteria.some((c) => c.name.toLowerCase() === n.toLowerCase())

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditName(item.name)
    setEditDesc(item.desc)
  }
  const saveEdit = () => {
    if (!editName.trim() || !editDesc.trim()) return
    setCriteria((prev) => prev.map((c) => (c.id === editingId ? { ...c, name: editName.trim(), desc: editDesc.trim() } : c)))
    setEditingId(null)
    flash([editingId])
  }

  const addCriterion = (item, importance) => {
    if (hasName(item.name)) return null
    const id = `u${nextId++}`
    const comp = item.comp ?? translateConcern(`${item.name}. ${item.desc}`)?.primary ?? 'Problem Solving'
    setCriteria((prev) => [...prev, { id, name: item.name, desc: item.desc, importance, comp }])
    return id
  }

  const submitNew = () => {
    if (!newName.trim() || !newDesc.trim()) return
    const id = addCriterion({ name: newName.trim(), desc: newDesc.trim() }, newGroup)
    if (id) flash([id])
    setNewName('')
    setNewDesc('')
    setNewGroup('veryImportant')
    setPanel(null)
  }

  // Composer: type or speak enriches the card and highlights the change.
  const applyPhrase = (text) => {
    const c = criterionFromPhrase(text)
    if (!c) return
    const existing = criteria.find((x) => x.name.toLowerCase() === c.name.toLowerCase())
    if (existing) {
      setCriteria((prev) => prev.map((x) => (x.id === existing.id ? { ...x, importance: c.importance } : x)))
      flash([existing.id])
    } else {
      const id = addCriterion(c, c.importance)
      if (id) flash([id])
    }
  }
  const sendComposer = () => {
    const text = composer.trim()
    if (!text) return
    setComposer('')
    applyPhrase(text)
  }
  const speak = () => applyPhrase('This role is heavy on stakeholder work.')

  // Drop a JD: a more substantial update, with a summary and an undo. The summary
  // reflects the real changes, so it never claims something it did not do.
  const applyJd = () => {
    const snapshot = criteria
    let next = [...criteria]
    const changed = []
    const parts = []

    if (!hasName('Stakeholder Management')) {
      const id = `u${nextId++}`
      next = [...next, { id, name: 'Stakeholder Management', desc: 'Keeps the people around the work aligned and moving.', importance: 'veryImportant', comp: 'Communication' }]
      changed.push(id)
      parts.push('added Stakeholder Management')
    }
    // Raise one criterion to Essential: Communication if it is not already, else
    // the first Very Important that is not the one we just added.
    const raise =
      next.find((c) => c.name === 'Communication' && c.importance !== 'essential') ??
      next.find((c) => c.importance === 'veryImportant' && c.name !== 'Stakeholder Management')
    if (raise) {
      next = next.map((c) => (c.id === raise.id ? { ...c, importance: 'essential' } : c))
      changed.push(raise.id)
      parts.push(`raised ${raise.name} to Essential`)
    }

    setCriteria(next)
    if (parts.length) setChangeSummary({ text: `From your JD I ${parts.join(' and ')}.`, snapshot })
    flash(changed)
  }
  const undoJd = () => {
    if (changeSummary?.snapshot) setCriteria(changeSummary.snapshot)
    setChangeSummary(null)
  }

  const reusable = REUSE_POOL.filter((s) => !hasName(s.name))

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline bg-surface px-6 py-4 lg:px-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-secondary transition-colors hover:border-ink/20 hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-secondary">Define the role</p>
          <h1 className="truncate text-xl font-bold text-ink">{roleTitle}</h1>
        </div>
        {onAskManager && (
          <Button variant="secondary" onClick={onAskManager} className="!px-3.5 !py-2 !text-[13px]">
            Ask a manager to define
          </Button>
        )}
      </div>

      {/* The list is the screen */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
          {/* One quiet line */}
          <div>
            <h2 className="text-2xl font-bold text-ink">{roleTitle}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-secondary">
              Here is what usually matters for a {roleTitle}. Change anything that is not right for you.
            </p>
          </div>

          {/* Groups: quiet left margin, 2-up grid on the right */}
          {GROUPS.map((g) => {
            const items = criteria.filter((c) => c.importance === g.key)
            const warn = g.key === 'essential' && items.length > 2
            return (
              <section key={g.key} className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                <div className="sm:w-[200px] sm:shrink-0 sm:pt-1">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-ink">{g.label}</h3>
                  <p className="mt-0.5 text-[13px] font-medium text-muted">
                    {items.length} criteri{items.length === 1 ? 'on' : 'a'}
                  </p>
                  <p className={`mt-1.5 text-[13px] leading-relaxed ${warn ? 'font-medium text-attention' : 'text-secondary'}`}>
                    {warn
                      ? `${word(items.length)} essentials. Each one rules people out fast. Consider keeping the two that matter most.`
                      : g.purpose}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  {items.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {items.map((c) => (
                        <CriterionCard
                          key={`${c.id}-${c.importance}`}
                          item={c}
                          essential={g.key === 'essential'}
                          highlighted={highlightIds.has(c.id)}
                          editing={editingId === c.id}
                          name={editName}
                          desc={editDesc}
                          setName={setEditName}
                          setDesc={setEditDesc}
                          onMove={(imp) => moveTo(c.id, imp)}
                          onEdit={() => startEdit(c)}
                          onRemove={() => remove(c.id)}
                          onSave={saveEdit}
                          onCancel={() => setEditingId(null)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="pt-1 text-[13px] text-muted">Nothing here yet.</p>
                  )}
                </div>
              </section>
            )
          })}

          {/* Add / Reuse */}
          <div className="flex flex-wrap gap-2 sm:pl-[232px]">
            <button
              type="button"
              onClick={() => setPanel(panel === 'add' ? null : 'add')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3.5 py-2 text-[13px] font-medium text-ink shadow-card transition-colors hover:border-ink/20"
            >
              <PlusIcon className="h-4 w-4" /> Add criterion
            </button>
            <button
              type="button"
              onClick={() => setPanel(panel === 'reuse' ? null : 'reuse')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3.5 py-2 text-[13px] font-medium text-ink shadow-card transition-colors hover:border-ink/20"
            >
              Reuse from another role
            </button>
          </div>

          {panel === 'add' && (
            <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface p-4 shadow-card sm:ml-[232px]">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                placeholder="Criterion name, e.g. Prioritisation"
                className="w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm font-medium text-ink shadow-card transition-colors placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                placeholder="One plain line: what it means for this role."
                className="w-full resize-none rounded-md border border-hairline bg-surface px-3 py-2 text-sm leading-relaxed text-ink shadow-card transition-colors placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {GROUPS.map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => setNewGroup(g.key)}
                      className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${
                        newGroup === g.key ? 'bg-ink text-white' : 'border border-hairline bg-surface text-secondary hover:text-ink'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => setPanel(null)}>
                    Cancel
                  </Button>
                  <Button onClick={submitNew} disabled={!newName.trim() || !newDesc.trim()}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {panel === 'reuse' && (
            <div className="flex flex-col gap-2 rounded-card border border-hairline bg-surface p-4 shadow-card sm:ml-[232px]">
              <p className="text-[13px] font-medium text-ink">Criteria from your other roles</p>
              {reusable.length > 0 ? (
                reusable.map((s) => (
                  <div key={s.name} className="flex items-start gap-3 rounded-lg border border-hairline bg-surface px-3.5 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm font-medium text-ink">{s.name}</span>
                        <span className="text-[11px] text-muted">from {s.from}</span>
                      </div>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-secondary">{s.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const id = addCriterion(s, 'veryImportant')
                        if (id) flash([id])
                      }}
                      className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md border border-hairline px-2.5 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-ink/20"
                    >
                      <PlusIcon className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                ))
              ) : (
                <p className="py-2 text-[13px] text-secondary">All of those are already on the list.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Composer bar: type, speak, or drop a JD to enrich the card. Optional. */}
      <div className="shrink-0 border-t border-hairline bg-surface px-6 py-3 lg:px-10">
        <div className="mx-auto w-full max-w-4xl">
          {changeSummary && (
            <div className="mb-2.5 flex flex-wrap items-center gap-2 rounded-lg border border-hairline bg-accent-soft/50 px-3.5 py-2 text-[13px] text-ink">
              <span className="min-w-0 flex-1">{changeSummary.text}</span>
              <button type="button" onClick={undoJd} className="font-medium text-strong transition-colors hover:underline">
                Undo
              </button>
              <button type="button" onClick={() => setChangeSummary(null)} aria-label="Dismiss" className="text-secondary hover:text-ink">
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={applyJd}
              aria-label="Attach a job description"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-secondary transition-colors hover:bg-background hover:text-ink"
            >
              <PaperclipIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={speak}
              aria-label="Speak"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-secondary transition-colors hover:bg-background hover:text-ink"
            >
              <MicIcon className="h-4 w-4" />
            </button>
            <div className="h-6 w-px bg-hairline" />
            <input
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  sendComposer()
                }
              }}
              placeholder="Tell me more about this role, or drop a JD…"
              className="min-w-0 flex-1 bg-transparent px-1 text-sm text-ink placeholder:text-muted focus:outline-none"
            />
            <Button onClick={sendComposer} disabled={!composer.trim()} aria-label="Send" className="!px-3.5">
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="shrink-0 border-t border-hairline bg-surface px-6 py-4 lg:px-10">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
          <span className="text-[13px] text-secondary">{criteria.length} criteria</span>
          <Button onClick={onComplete}>{reviewLabel}</Button>
        </div>
      </div>
    </div>
  )
}
