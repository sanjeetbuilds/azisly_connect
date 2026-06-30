import { useMemo, useState } from 'react'
import { Button, SearchInput, CandidateTable, CandidateDetail } from '../components'
import ShareWithManagerModal from '../components/ShareWithManagerModal.jsx'
import { CheckIcon, XIcon } from '../components/icons.jsx'
import { candidates, isReadyToReview, roleTotals } from '../data/candidates.js'
import { interviews } from '../data/interviews.js'

// Workflow tabs. Each maps to one or more lifecycle states; "All" matches every
// state. The active tab decides the single bulk action and what is selectable.
const TABS = [
  { key: 'all', label: 'All' },
  { key: 'to-interview', label: 'To interview', stages: ['Sourced'] },
  { key: 'in-progress', label: 'In progress', stages: ['Invited', 'Interviewing'] },
  { key: 'ready', label: 'Ready to review', stages: ['Ready to review', 'Needs human'] },
  { key: 'shared', label: 'Shared', stages: ['Shared'] },
  { key: 'decided', label: 'Decided', stages: ['Taken forward', 'Passed'] },
]

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
 * CandidatesScreen — a workflow-led review for one role (Senior Product
 * Engineer). The count and ready signal live in the title and derive from one
 * list. Stage tabs, a relocated search field, and a single discoverable primary
 * action that is disabled until eligible rows are selected.
 */
export default function CandidatesScreen({ onInvite, onDecide, managerResponse }) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')
  const [sort, setSort] = useState({ key: 'score', dir: 'desc' })
  const [selectedId, setSelectedId] = useState(null)
  const [picked, setPicked] = useState(() => new Set())
  const [opened, setOpened] = useState(() => new Set())
  const [shareOpen, setShareOpen] = useState(false)
  const [noticeOpen, setNoticeOpen] = useState(true)

  // The active action and what it accepts.
  const action = tab === 'to-interview' ? 'invite' : 'share'
  const eligibility = (c) => {
    if (action === 'invite') {
      return c.stage === 'Sourced' ? { ok: true } : { ok: false, reason: 'Already in the pipeline' }
    }
    if (isReadyToReview(c)) return { ok: true }
    if (c.stage === 'Shared') return { ok: false, reason: 'Already shared' }
    if (c.stage === 'Taken forward' || c.stage === 'Passed') return { ok: false, reason: 'Already decided' }
    return { ok: false, reason: 'Not scored yet' }
  }
  const primary =
    action === 'invite'
      ? { label: 'Invite to interview', helper: 'Select sourced candidates to invite', run: () => onInvite?.() }
      : { label: 'Share with hiring manager', helper: 'Select scored candidates to share', run: () => setShareOpen(true) }

  const isFresh = (c) => Boolean(c.isNew) && !opened.has(c.id)

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    const active = TABS.find((t) => t.key === tab)
    const filtered = candidates.filter((c) => {
      if (active?.stages && !active.stages.includes(c.stage)) return false
      if (q) {
        const hay = [c.name, c.role, c.location, ...c.skills].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    const sorted = sortCandidates(filtered, sort)
    // New, unopened candidates float to the top (stable within each group).
    return [...sorted].sort((a, b) => (isFresh(b) ? 1 : 0) - (isFresh(a) ? 1 : 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tab, sort, opened])

  const selected = candidates.find((c) => c.id === selectedId) ?? null
  const pickedEligible = candidates.filter((c) => picked.has(c.id) && eligibility(c).ok)

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

  const openDetail = (id) => {
    setSelectedId(id)
    setOpened((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
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
      const eligibleVisible = visible.filter((c) => eligibility(c).ok)
      const allIn = eligibleVisible.length > 0 && eligibleVisible.every((c) => prev.has(c.id))
      const next = new Set(prev)
      eligibleVisible.forEach((c) => (allIn ? next.delete(c.id) : next.add(c.id)))
      return next
    })
  const clearPicked = () => setPicked(new Set())

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Mobile-only header */}
      <header className="flex h-14 shrink-0 items-center border-b border-hairline px-5 lg:hidden">
        <span className="font-medium tracking-tight text-ink">
          Azisly <span className="text-secondary">Recruit</span>
        </span>
      </header>

      {/* Page header — count and ready signal derive from one list */}
      <div className="shrink-0 px-6 pb-4 pt-8 lg:px-8">
        <p className="text-sm text-secondary">Pipeline · Senior Product Engineer</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h1 className="text-2xl text-ink">Candidates</h1>
          <span className="inline-flex items-center rounded-full bg-info/10 px-2 py-0.5 font-mono text-xs font-medium text-info tabular-nums">
            {roleTotals.total}
          </span>
          {roleTotals.readyToReview > 0 && (
            <span className="text-[13px] font-medium text-info">
              {roleTotals.readyToReview} ready to review
            </span>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 lg:px-8">
        {/* The hiring manager has responded — a dismissible notification */}
        {managerResponse && noticeOpen && (
          <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-strong/25 bg-strong/[0.05] px-5 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-strong/10 text-strong">
              <CheckIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">
                <span className="font-medium">{managerResponse.manager}</span> took{' '}
                {managerResponse.approvedCount} candidate
                {managerResponse.approvedCount === 1 ? '' : 's'} forward
              </p>
              <p className="text-[13px] text-secondary">just now</p>
            </div>
            <Button onClick={managerResponse.onView}>See the picks</Button>
            <button
              type="button"
              onClick={() => setNoticeOpen(false)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-lg p-1.5 text-secondary transition-colors hover:bg-strong/10 hover:text-ink"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Search — its own line, a full, clearly styled field */}
        <div className="mb-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search candidates by name, skill, or location" />
        </div>

        <div className="overflow-hidden rounded-xl border border-hairline bg-surface shadow-card">
          {/* Toolbar — stage tabs and ONE primary action, always visible */}
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
            <div className="ml-auto flex items-center gap-3">
              {pickedEligible.length > 0 ? (
                <span className="text-[13px] text-secondary">
                  <span className="font-medium text-ink">{pickedEligible.length}</span> selected ·{' '}
                  <button
                    type="button"
                    onClick={clearPicked}
                    className="font-medium text-info transition-colors hover:underline"
                  >
                    Clear
                  </button>
                </span>
              ) : (
                <span className="hidden text-[13px] text-secondary sm:inline">{primary.helper}</span>
              )}
              <Button disabled={pickedEligible.length === 0} onClick={primary.run}>
                {primary.label}
              </Button>
            </div>
          </div>

          {/* Results — list only */}
          {visible.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-secondary">
              No candidates in this view.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <CandidateTable
                candidates={visible}
                selectedId={selectedId}
                onSelect={openDetail}
                sort={sort}
                onSort={handleSort}
                picked={picked}
                onToggle={toggle}
                onToggleAll={toggleAll}
                eligibility={eligibility}
                isNew={isFresh}
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
          <div
            key={selected.id}
            className="absolute inset-y-0 right-0 z-30 flex w-full max-w-xl animate-slide-in-right flex-col overflow-y-auto border-l border-hairline bg-surface shadow-overlay"
          >
            <CandidateDetail
              candidate={selected}
              onBack={() => setSelectedId(null)}
              onDecide={onDecide}
              interview={interviews[selected.id]}
            />
          </div>
        </>
      )}

      {/* Share with hiring manager: only ever the eligible selection */}
      {shareOpen && (
        <ShareWithManagerModal
          candidates={pickedEligible}
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
