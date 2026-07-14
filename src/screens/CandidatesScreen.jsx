import { useMemo, useState } from 'react'
import {
  Button,
  PageHeader,
  Tabs,
  StatusPill,
  RowMenu,
  CandidateTable,
  CandidateDetail,
  MatchingProgress,
} from '../components'
import ShareWithManagerModal from '../components/ShareWithManagerModal.jsx'
import {
  SearchIcon,
  XIcon,
  SendIcon,
  CheckIcon,
  LinkIcon,
  ArrowRightIcon,
  MailIcon,
  PhoneIcon,
  DownloadIcon,
} from '../components/icons.jsx'
import {
  candidates as ALL,
  contactsFor,
  compareInterviewed,
  interviewGroupOf,
  INTERVIEW_GROUP_LABEL,
} from '../data/candidates.js'
import { interviews } from '../data/interviews.js'
import { buildInterviewLink } from '../lib/magicLink.js'
import { downloadCsv, downloadCv } from '../lib/exports.js'

const HM_NAME = 'Anjali Rao'
const SEED_TAKEN = ALL.filter((c) => c.stage === 'Taken forward' || c.stage === 'Moving forward').map((c) => c.id)

// One status per candidate, from the seed lifecycle plus session actions.
function statusOf(c, s) {
  if (s.moved.has(c.id) || c.stage === 'Taken forward' || c.stage === 'Moving forward') return 'taken_forward'
  if (s.declined.has(c.id) || s.rejected.has(c.id) || c.stage === 'Passed') return 'declined'
  if (s.shared.has(c.id) || c.stage === 'Shared') return 'shared'
  if (c.incomplete) return 'incomplete' // interview started but never finished — unscored
  if (c.score != null) return 'interviewed'
  if (c.declinedInterview) return 'declined_interview'
  if (c.lapsed) return 'lapsed'
  if (s.invited.has(c.id) || c.stage === 'Invited' || c.stage === 'Interviewing') return 'pending'
  return 'matched'
}

const TAB_OF = {
  matched: 'matched',
  pending: 'invited',
  lapsed: 'invited',
  declined_interview: 'invited',
  incomplete: 'interviewed',
  interviewed: 'interviewed',
  shared: 'interviewed',
  taken_forward: 'taken',
}

const TAB_DEFS = [
  { key: 'matched', label: 'Matched' },
  { key: 'invited', label: 'Invited' },
  { key: 'interviewed', label: 'Interviewed' },
  { key: 'taken', label: 'Taken forward' },
]

/* A quiet but always-visible row action; the row hover lifts its border. */
function RowPrimary({ onClick, icon, children }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-hairline bg-surface px-2.5 py-1.5 text-[13px] font-medium text-ink shadow-card transition-colors hover:border-accent hover:text-strong group-hover:border-accent/60"
    >
      {icon}
      {children}
    </button>
  )
}

/**
 * CandidatesScreen — one role's candidates as stage tabs. Actions live in a fixed
 * slot with a reserved menu to their right; consequential actions confirm (invite
 * toast, reject dialog); statuses read in plain words.
 */
export default function CandidatesScreen({
  roleTitle = 'Product Engineer',
  roleId = 'r-spe',
  requirements,
  runMatch = false,
}) {
  const [phase, setPhase] = useState(runMatch ? 'matching' : 'list')
  const [tab, setTab] = useState('matched')
  const [showDeclined, setShowDeclined] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [picked, setPicked] = useState(() => new Set())
  const [shareIds, setShareIds] = useState(null)
  const [contactId, setContactId] = useState(null)
  const [rejectIds, setRejectIds] = useState(null)
  const [hmNotice, setHmNotice] = useState(null)
  const [toast, setToast] = useState(null)
  const [seenTaken, setSeenTaken] = useState(() => new Set(SEED_TAKEN))

  const [invited, setInvited] = useState(() => new Set())
  const [declined, setDeclined] = useState(() => new Set())
  const [shared, setShared] = useState(() => new Set())
  const [moved, setMoved] = useState(() => new Set())
  const [rejected, setRejected] = useState(() => new Set())
  const sets = { invited, declined, shared, moved, rejected }

  const status = (c) => statusOf(c, sets)
  const nameOf = (id) => ALL.find((c) => c.id === id)?.name

  const counts = TAB_DEFS.reduce((acc, t) => {
    acc[t.key] = ALL.filter((c) => TAB_OF[status(c)] === t.key).length
    return acc
  }, {})
  const declinedCount = ALL.filter((c) => status(c) === 'declined').length
  const tabs = TAB_DEFS.map((t) => ({ ...t, count: counts[t.key] }))

  const takenList = ALL.filter((c) => status(c) === 'taken_forward')
  const newTaken = new Set(takenList.filter((c) => !seenTaken.has(c.id)).map((c) => c.id))

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = ALL.filter((c) => {
      const st = status(c)
      if (showDeclined ? st !== 'declined' : TAB_OF[st] !== tab) return false
      if (q) {
        const hay = [c.name, c.role, ...c.work, ...c.skills].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    // The Interviewed list ranks by verdict tier first, then score within tier;
    // the incomplete group sorts to the top. Never a raw-number sort.
    if (!showDeclined && tab === 'interviewed') list.sort(compareInterviewed)
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, showDeclined, search, invited, declined, shared, moved, rejected])

  const selected = ALL.find((c) => c.id === selectedId) ?? null
  const pickedList = ALL.filter((c) => picked.has(c.id))
  const n = pickedList.length

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast((m) => (m === message ? null : m)), 3200)
  }
  const add = (setter) => (ids) =>
    setter((prev) => {
      const next = new Set(prev)
      ;[].concat(ids).forEach((id) => next.add(id))
      return next
    })
  const dropPicked = (ids) =>
    setPicked((prev) => {
      const next = new Set(prev)
      ;[].concat(ids).forEach((id) => next.delete(id))
      return next
    })
  const invite = (ids) => {
    const list = [].concat(ids)
    add(setInvited)(list)
    dropPicked(list)
    showToast(list.length === 1 ? `Invite sent to ${nameOf(list[0])}` : `${list.length} invites sent`)
  }
  const takeForward = (ids) => {
    add(setMoved)(ids)
    dropPicked(ids)
  }
  const decline = (ids) => {
    add(setDeclined)(ids)
    dropPicked(ids)
  }
  const doReject = (ids) => {
    add(setRejected)(ids)
    dropPicked(ids)
  }
  const askReject = (ids) => setRejectIds([].concat(ids))
  const openShare = (ids) => setShareIds([].concat(ids))
  const copyInviteLink = (c) => {
    const link = buildInterviewLink({ candidateId: c.id, roleId })
    navigator.clipboard?.writeText(link).catch(() => {})
    showToast('Invite link copied')
  }
  // Sharing marks awaiting-manager, then simulates the manager taking the
  // candidate forward via their link while the recruiter is away.
  const confirmShare = (ids) => {
    const list = [].concat(ids)
    add(setShared)(list)
    const first = ALL.find((c) => c.id === list[0])
    setTimeout(() => {
      add(setMoved)(list)
      if (first) setHmNotice({ name: first.name })
    }, 3500)
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
      const next = new Set(prev)
      visible.forEach((c) => (allIn ? next.delete(c.id) : next.add(c.id)))
      return next
    })
  const clearPicked = () => setPicked(new Set())
  const markTakenSeen = () => setSeenTaken((prev) => new Set([...prev, ...takenList.map((c) => c.id)]))

  const goTab = (key) => {
    if (tab === 'taken' && !showDeclined) markTakenSeen()
    setTab(key)
    setShowDeclined(false)
    setSelectedId(null)
    clearPicked()
  }
  const toggleDeclined = () => {
    if (tab === 'taken' && !showDeclined) markTakenSeen()
    setShowDeclined((v) => !v)
    setSelectedId(null)
    clearPicked()
  }

  const inMatched = !showDeclined && tab === 'matched'
  const inInterviewed = !showDeclined && tab === 'interviewed'
  const inTaken = !showDeclined && tab === 'taken'
  const selectable = inMatched || inInterviewed
  const showInterview = !showDeclined && (tab === 'interviewed' || tab === 'taken')

  // The visible primary action (or plain status) in the fixed action slot.
  const rowAction = (c) => {
    const st = status(c)
    if (st === 'matched') {
      return (
        <RowPrimary onClick={() => invite(c.id)} icon={<SendIcon className="h-3.5 w-3.5" />}>
          Invite to interview
        </RowPrimary>
      )
    }
    if (st === 'pending') {
      return (
        <div className="flex flex-col items-end gap-0.5">
          <StatusPill label="Awaiting response" tone="neutral" />
          <span className="text-[11px] text-muted">Invited 3 days ago</span>
        </div>
      )
    }
    if (st === 'lapsed') {
      return (
        <div className="flex flex-col items-end gap-1">
          <StatusPill label="Invite expired" tone="warning" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              invite(c.id)
            }}
            className="text-[12px] font-medium text-strong transition-colors hover:underline"
          >
            Re-invite
          </button>
        </div>
      )
    }
    if (st === 'declined_interview') {
      return (
        <div className="flex flex-col items-end gap-0.5">
          <StatusPill label="Declined" tone="danger" />
          <span className="text-[11px] text-muted">Turned it down</span>
        </div>
      )
    }
    if (st === 'incomplete') {
      return (
        <div className="flex flex-col items-end gap-0.5">
          <StatusPill label="Interview incomplete" tone="neutral" />
          <span className="text-[11px] text-muted">Not finished — not scored</span>
        </div>
      )
    }
    if (st === 'interviewed') {
      return (
        <RowPrimary onClick={() => takeForward(c.id)} icon={<ArrowRightIcon className="h-3.5 w-3.5" />}>
          Take forward
        </RowPrimary>
      )
    }
    if (st === 'shared') {
      return <StatusPill label={`With ${HM_NAME} to review`} tone="accent" />
    }
    if (st === 'taken_forward') {
      return (
        <RowPrimary onClick={() => setContactId(c.id)} icon={<MailIcon className="h-3.5 w-3.5" />}>
          Reach out
        </RowPrimary>
      )
    }
    return <StatusPill label="Declined" tone="danger" />
  }

  // The reserved far-right menu; null keeps the slot empty but aligned.
  const rowMenu = (c) => {
    const st = status(c)
    if (st === 'matched') {
      return (
        <RowMenu
          items={[
            { label: 'Decline', tone: 'danger', icon: <XIcon className="h-3.5 w-3.5" />, onClick: () => decline(c.id) },
            { label: 'Copy invite link', icon: <LinkIcon className="h-3.5 w-3.5" />, onClick: () => copyInviteLink(c) },
          ]}
        />
      )
    }
    if (st === 'interviewed') {
      return (
        <RowMenu
          items={[
            { label: 'Share with manager', icon: <LinkIcon className="h-3.5 w-3.5" />, onClick: () => openShare(c.id) },
            { label: 'Reject', tone: 'danger', icon: <XIcon className="h-3.5 w-3.5" />, onClick: () => askReject(c.id) },
          ]}
        />
      )
    }
    if (st === 'shared') {
      return (
        <RowMenu
          items={[
            { label: 'Take forward', icon: <ArrowRightIcon className="h-3.5 w-3.5" />, onClick: () => takeForward(c.id) },
            { label: 'Reject', tone: 'danger', icon: <XIcon className="h-3.5 w-3.5" />, onClick: () => askReject(c.id) },
          ]}
        />
      )
    }
    if (st === 'taken_forward') {
      return (
        <RowMenu items={[{ label: 'Download CV', icon: <DownloadIcon className="h-3.5 w-3.5" />, onClick: () => downloadCv(c) }]} />
      )
    }
    return null
  }

  const renderEmpty = () => {
    if (showDeclined) return 'No declined candidates.'
    if (tab === 'matched') {
      if (counts.matched === 0) {
        if (ALL.length === 0) return 'No candidates matched this role yet.'
        return (
          <span>
            You have reviewed all matched candidates.{' '}
            <button
              type="button"
              onClick={() => goTab('invited')}
              className="font-medium text-strong transition-colors hover:underline"
            >
              See them in Invited
            </button>
            .
          </span>
        )
      }
      return 'No candidates match your search.'
    }
    if ((counts[tab] ?? 0) === 0) {
      const label = TAB_DEFS.find((t) => t.key === tab)?.label ?? 'this stage'
      return `No candidates in ${label} yet.`
    }
    return 'No candidates match your search.'
  }

  // Selection-bar actions adapt to what is selected.
  const bulkActions = () => {
    const ids = pickedList.map((c) => c.id)
    if (inMatched) {
      return (
        <>
          <Button variant="secondary" onClick={() => decline(ids)}>
            <XIcon className="h-4 w-4" />
            Decline
          </Button>
          <Button onClick={() => invite(ids)}>
            <SendIcon className="h-4 w-4" />
            Invite {n} to interview
          </Button>
        </>
      )
    }
    // interviewed: share only applies to not-yet-shared candidates
    const shareable = pickedList.filter((c) => status(c) === 'interviewed').map((c) => c.id)
    return (
      <>
        <Button variant="secondary" onClick={() => askReject(ids)}>
          <XIcon className="h-4 w-4" />
          Reject
        </Button>
        {shareable.length > 0 && (
          <Button variant="secondary" onClick={() => openShare(shareable)}>
            <LinkIcon className="h-4 w-4" />
            Share with manager{shareable.length > 1 ? ` (${shareable.length})` : ''}
          </Button>
        )}
        <Button onClick={() => takeForward(ids)}>
          <ArrowRightIcon className="h-4 w-4" />
          Take forward
        </Button>
      </>
    )
  }

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Mobile-only header */}
      <header className="flex h-14 shrink-0 items-center border-b border-hairline bg-surface px-5 lg:hidden">
        <span className="font-semibold tracking-tight text-ink">Azisly Recruit</span>
      </header>

      {/* Page header — one title; counts live on the tabs */}
      <div className="shrink-0 px-6 pb-4 pt-8 lg:px-8">
        <PageHeader
          breadcrumb={['Roles', roleTitle, 'Candidates']}
          title={phase === 'matching' ? 'Matching candidates' : 'Candidates'}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 lg:px-8">
        {phase === 'matching' && <MatchingProgress count={ALL.length} onShow={() => setPhase('list')} />}

        {phase === 'list' && (
          <div className="flex flex-col gap-4">
            {/* Manager notification */}
            {hmNotice && (
              <div className="flex flex-wrap items-center gap-3 rounded-card border border-accent/25 bg-accent-soft/60 px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <p className="min-w-0 flex-1 text-sm text-ink">
                  <span className="font-medium">{HM_NAME}</span> took{' '}
                  <span className="font-medium">{hmNotice.name}</span> forward from their review link.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    goTab('taken')
                    setHmNotice(null)
                  }}
                >
                  View
                </Button>
                <button
                  type="button"
                  onClick={() => setHmNotice(null)}
                  aria-label="Dismiss"
                  className="rounded-md p-1.5 text-secondary transition-colors hover:bg-background hover:text-ink"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <Tabs tabs={tabs} value={showDeclined ? null : tab} onChange={goTab} />

            <div className="rounded-card border border-hairline bg-surface shadow-card">
              {/* Filter row + (taken) Download CSV + Declined toggle */}
              <div className="flex flex-wrap items-center gap-2.5 border-b border-hairline px-4 py-3">
                <div className="relative flex items-center">
                  <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, skill, company"
                    className="w-60 rounded-md border border-hairline bg-surface py-2 pl-9 pr-3 text-sm text-ink shadow-card transition-colors placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                  />
                </div>

                <div className="ml-auto flex items-center gap-2.5">
                  {inTaken && takenList.length > 0 && (
                    <Button variant="secondary" onClick={() => downloadCsv(takenList)}>
                      <DownloadIcon className="h-4 w-4" />
                      Download CSV
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={toggleDeclined}
                    className={`rounded-md border px-3 py-2 text-[13px] font-medium transition-colors ${
                      showDeclined
                        ? 'border-accent bg-accent-soft text-strong'
                        : 'border-hairline bg-surface text-secondary hover:text-ink'
                    }`}
                  >
                    Declined {declinedCount > 0 ? `· ${declinedCount}` : ''}
                  </button>
                </div>
              </div>

              {/* Selection action bar */}
              {selectable && n > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-b border-hairline bg-accent-soft/40 px-4 py-2.5">
                  <span className="text-[13px] text-secondary">
                    <span className="font-semibold text-ink">{n}</span> selected ·{' '}
                    <button type="button" onClick={clearPicked} className="font-medium text-strong hover:underline">
                      Clear
                    </button>
                  </span>
                  <div className="ml-auto flex items-center gap-2">{bulkActions()}</div>
                </div>
              )}

              {visible.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-secondary">{renderEmpty()}</div>
              ) : (
                <CandidateTable
                  candidates={visible}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  selectable={selectable}
                  picked={picked}
                  onToggle={toggle}
                  onToggleAll={toggleAll}
                  showInterview={showInterview}
                  newIds={newTaken}
                  rowAction={rowAction}
                  rowMenu={rowMenu}
                  groupOf={inInterviewed ? interviewGroupOf : undefined}
                  groupLabels={INTERVIEW_GROUP_LABEL}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Side panel */}
      {phase === 'list' && selected && (
        <>
          <button
            type="button"
            aria-label="Close detail"
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 z-20 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[1px]"
          />
          <div
            key={selected.id}
            className="absolute inset-y-0 right-0 z-30 flex w-full max-w-lg animate-slide-in-right flex-col overflow-y-auto border-l border-hairline bg-surface shadow-overlay"
          >
            <CandidateDetail
              candidate={selected}
              onBack={() => setSelectedId(null)}
              interview={interviews[selected.id]}
              recruiter={{
                status: status(selected),
                managerName: HM_NAME,
                onInvite: () => invite(selected.id),
                onDecline: () => decline(selected.id),
                onShare: () => openShare(selected.id),
                onTakeForward: () => takeForward(selected.id),
                onReject: () => askReject(selected.id),
                onReachOut: () => setContactId(selected.id),
                onDownloadCv: () => downloadCv(selected),
              }}
            />
          </div>
        </>
      )}

      {/* Share with manager */}
      {shareIds && (
        <ShareWithManagerModal
          candidates={ALL.filter((c) => shareIds.includes(c.id))}
          roleTitle={roleTitle}
          onClose={() => {
            confirmShare(shareIds)
            setShareIds(null)
            clearPicked()
          }}
        />
      )}

      {/* Reach out */}
      {contactId && (
        <ContactModal candidate={ALL.find((c) => c.id === contactId)} onClose={() => setContactId(null)} />
      )}

      {/* Reject confirmation */}
      {rejectIds && (
        <RejectModal
          names={rejectIds.map(nameOf)}
          onCancel={() => setRejectIds(null)}
          onConfirm={() => {
            doReject(rejectIds)
            setRejectIds(null)
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-[60] -translate-x-1/2 animate-fade-in-up">
          <div className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-overlay">
            <CheckIcon className="h-4 w-4 text-accent-dot" />
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

/* A copyable field row. */
function CopyRow({ icon, value }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="flex w-full items-center gap-3 rounded-md border border-hairline bg-surface px-3.5 py-2.5 text-left text-sm text-ink transition-colors hover:border-ink/20"
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{value}</span>
      {copied ? (
        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-strong">
          <CheckIcon className="h-3 w-3" /> Copied
        </span>
      ) : (
        <span className="text-[12px] text-secondary">Copy</span>
      )}
    </button>
  )
}

/* Reach-out contact launchpad. */
function ContactModal({ candidate, onClose }) {
  const [copiedAll, setCopiedAll] = useState(false)
  if (!candidate) return null
  const { email, phone } = contactsFor(candidate.name)
  const copyAll = () => {
    navigator.clipboard?.writeText(`${candidate.name}\n${email}\n${phone}`).catch(() => {})
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }
  return (
    <>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 z-40 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[1px]"
      />
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in-up rounded-card border border-hairline bg-surface p-6 shadow-overlay">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">Reach out to {candidate.name}</h2>
              <p className="text-[13px] text-secondary">Taken forward. Contact is yours for offline rounds.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md border border-hairline p-1.5 text-secondary transition-colors hover:border-ink/30 hover:text-ink"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-5 flex flex-col gap-2.5">
            <CopyRow icon={<MailIcon className="h-4 w-4 text-secondary" />} value={email} />
            <CopyRow icon={<PhoneIcon className="h-4 w-4 text-secondary" />} value={phone} />
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => downloadCv(candidate)}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-strong transition-colors hover:underline"
            >
              <DownloadIcon className="h-4 w-4" /> Download CV
            </button>
            <div className="flex items-center gap-3">
              <a href={`mailto:${email}`} className="text-[13px] font-medium text-strong transition-colors hover:underline">
                Open email
              </a>
              <Button variant="secondary" onClick={copyAll}>
                {copiedAll ? (
                  <>
                    <CheckIcon className="h-4 w-4" /> Copied
                  </>
                ) : (
                  'Copy details'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* Reject confirmation dialog. */
function RejectModal({ names = [], onCancel, onConfirm }) {
  const single = names.length === 1
  return (
    <>
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 z-40 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[1px]"
      />
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in-up rounded-card border border-hairline bg-surface p-6 shadow-overlay">
          <h2 className="text-lg font-semibold text-ink">
            {single ? `Reject ${names[0]}?` : `Reject ${names.length} candidates?`}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            {single ? 'They will' : 'They will all'} be moved out of consideration for this role.
          </p>
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-danger px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              <XIcon className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
