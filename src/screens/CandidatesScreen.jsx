import { useMemo, useState } from 'react'
import { Button, SearchInput, Dropdown, CandidateTable, CandidateDetail } from '../components'
import ShareWithManagerModal from '../components/ShareWithManagerModal.jsx'
import { CheckIcon } from '../components/icons.jsx'
import { candidates } from '../data/candidates.js'

// Workflow tabs. Each maps to one or more lifecycle states; "All" matches every
// state. The active tab decides the bulk action shown on selection.
const TABS = [
  { key: 'all', label: 'All' },
  { key: 'to-interview', label: 'To interview', stages: ['Sourced'] },
  { key: 'in-progress', label: 'In progress', stages: ['Invited', 'Interviewing'] },
  { key: 'ready', label: 'Ready to review', stages: ['Scored', 'Needs human'] },
  { key: 'shared', label: 'Shared', stages: ['Shared'] },
  { key: 'decided', label: 'Decided', stages: ['Taken forward', 'Passed'] },
]

// Ready to share = scored candidates awaiting a recruiter look (Scored or
// Needs human). Stable across filters, so it reads as a workload signal.
const READY_TO_SHARE = candidates.filter((c) => ['Scored', 'Needs human'].includes(c.stage)).length

function sortCandidates(list, { key, dir }) {
  const sorted = [...list].sort((a, b) => {
    let cmp = 0
    if (key === 'name') cmp = a.name.localeCompare(b.name)
    else if (key === 'score') cmp = (a.score ?? -1) - (b.score ?? -1)
    else if (key === 'applied') cmp = a.appliedSort - b.appliedSort
    return dir === 'asc' ? cmp : -cmp
  })
  return sorted
}

/**
 * CandidatesScreen — a workflow-led review. The count lives in the title, stage
 * tabs replace filter dropdowns, search is a quiet right-aligned field, and the
 * only floating action is a contextual bar that appears when rows are selected.
 */
export default function CandidatesScreen({ onInvite, onDecide, managerResponse }) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')
  const [role, setRole] = useState('all')
  const [sort, setSort] = useState({ key: 'score', dir: 'desc' })
  const [selectedId, setSelectedId] = useState(null)
  const [picked, setPicked] = useState(() => new Set())
  const [shareOpen, setShareOpen] = useState(false)

  const roleOptions = [
    { value: 'all', label: 'All roles' },
    ...[...new Set(candidates.map((c) => c.role))].map((r) => ({ value: r, label: r })),
  ]

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    const active = TABS.find((t) => t.key === tab)
    const filtered = candidates.filter((c) => {
      if (active?.stages && !active.stages.includes(c.stage)) return false
      if (role !== 'all' && c.role !== role) return false
      if (q) {
        const hay = [c.name, c.role, c.location, ...c.skills].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    return sortCandidates(filtered, sort)
  }, [search, tab, role, sort])

  const selected = candidates.find((c) => c.id === selectedId) ?? null

  const handleSort = (key) =>
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'name' ? 'asc' : 'desc' },
    )

  const switchTab = (key) => {
    setTab(key)
    setPicked(new Set())
    setSelectedId(null)
  }

  const toggle = (id) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const toggleAll = () =>
    setPicked((prev) => {
      const allIn = visible.length > 0 && visible.every((c) => prev.has(c.id))
      return allIn ? new Set() : new Set(visible.map((c) => c.id))
    })
  const clearPicked = () => setPicked(new Set())
  const pickedCandidates = candidates.filter((c) => picked.has(c.id))

  // The bulk primary depends on the active tab.
  const bulk =
    tab === 'to-interview'
      ? { label: 'Invite to interview', run: () => onInvite?.() }
      : { label: 'Share with hiring manager', run: () => setShareOpen(true) }

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Mobile-only header */}
      <header className="flex h-14 shrink-0 items-center border-b border-hairline px-5 lg:hidden">
        <span className="font-medium tracking-tight text-ink">
          Azisly <span className="text-secondary">Recruit</span>
        </span>
      </header>

      {/* Page header — count chip and ready signal live in the title */}
      <div className="shrink-0 px-6 pb-5 pt-8 lg:px-8">
        <p className="text-sm text-secondary">Pipeline · Senior Product Engineer</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h1 className="text-2xl text-ink">Candidates</h1>
          <span className="inline-flex items-center rounded-full bg-info/10 px-2 py-0.5 font-mono text-xs font-medium text-info tabular-nums">
            {visible.length}
          </span>
          {READY_TO_SHARE > 0 && (
            <span className="text-[13px] font-medium text-info">{READY_TO_SHARE} ready to share</span>
          )}
        </div>
      </div>

      {/* Content: a floating surface holding the toolbar + table */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 lg:px-8">
        {/* The hiring manager has responded — recruiter's update */}
        {managerResponse && (
          <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-strong/25 bg-strong/[0.05] px-5 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-strong/10 text-strong">
              <CheckIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">
                <span className="font-medium">{managerResponse.manager}</span> responded to your{' '}
                {managerResponse.roleTitle} shortlist
              </p>
              <p className="text-[13px] text-secondary">
                {managerResponse.approvedCount} taken forward · just now
              </p>
            </div>
            <Button onClick={managerResponse.onView}>See the picks</Button>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-hairline bg-surface shadow-card">
          {/* Toolbar — stage tabs on the left, a quiet search on the right */}
          <div className="flex flex-wrap items-center gap-3 border-b border-hairline px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => switchTab(t.key)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    tab === t.key ? 'bg-ink text-surface' : 'text-secondary hover:bg-background hover:text-ink'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Dropdown label="Role" value={role} options={roleOptions} onChange={setRole} />
              <div className="w-44">
                <SearchInput value={search} onChange={setSearch} />
              </div>
            </div>
          </div>

          {/* Contextual selection bar — only when rows are selected */}
          {picked.size > 0 && (
            <div className="flex flex-wrap items-center gap-3 border-b border-hairline bg-info-soft px-5 py-2.5">
              <span className="text-sm text-ink">
                <span className="font-medium">{picked.size}</span> selected
              </span>
              <button
                type="button"
                onClick={clearPicked}
                className="text-[13px] font-medium text-info transition-colors hover:underline"
              >
                Clear
              </button>
              <div className="ml-auto">
                <Button onClick={bulk.run}>{bulk.label}</Button>
              </div>
            </div>
          )}

          {/* Results — list only */}
          {visible.length === 0 ? (
            <div className="px-6 py-20 text-center text-sm text-secondary">
              No candidates in this view.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <CandidateTable
                candidates={visible}
                selectedId={selectedId}
                onSelect={setSelectedId}
                sort={sort}
                onSort={handleSort}
                picked={picked}
                onToggle={toggle}
                onToggleAll={toggleAll}
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating detail drawer */}
      {selected && (
        <>
          <button
            type="button"
            aria-label="Close detail"
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 z-20 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[1px]"
          />
          <div className="absolute inset-y-0 right-0 z-30 flex w-full max-w-xl animate-slide-in-right flex-col overflow-y-auto border-l border-hairline bg-surface shadow-overlay">
            <CandidateDetail candidate={selected} onBack={() => setSelectedId(null)} onDecide={onDecide} />
          </div>
        </>
      )}

      {/* Share with hiring manager: confirm → review link */}
      {shareOpen && (
        <ShareWithManagerModal
          candidates={pickedCandidates}
          roleTitle="Senior Product Engineer"
          onClose={() => {
            setShareOpen(false)
            clearPicked()
          }}
        />
      )}
    </div>
  )
}
