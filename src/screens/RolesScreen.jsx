import { useEffect, useState } from 'react'
import { Button, PageHeader } from '../components'
import { ChevronRightIcon, CheckIcon, XIcon, PlusIcon } from '../components/icons.jsx'
import { ROLE_STATES } from '../data/roles.js'

function EmptyState({ onCreateRole }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-6 pb-16">
      <div className="flex max-w-sm flex-col items-center gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-surface text-secondary shadow-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
            <rect x="3.5" y="7.5" width="17" height="11.5" rx="2" />
            <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg text-ink">No roles yet</h2>
          <p className="text-sm leading-relaxed text-secondary">
            Create your first role to start sourcing and judging candidates.
          </p>
        </div>
        <Button onClick={onCreateRole}>Create your first role</Button>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="min-w-0 flex-1">
        <div className="h-3.5 w-40 rounded bg-hairline" />
        <div className="mt-2 h-3 w-28 rounded bg-hairline/70" />
      </div>
      <div className="h-5 w-28 rounded-full bg-hairline" />
    </div>
  )
}

// One status per role, grouped into kinds so the recruiter can scan for what is
// in their court. priority drives the attention-based sort (lower is sooner).
//   needs    the recruiter must act now (loudest)
//   progress the system is working, no action
//   setup    waiting on setup, a definition, or a submit
//   done     closed
function roleStatusMeta(role) {
  switch (role.state) {
    case 'ready':
      return { kind: 'needs', label: `${role.candidatesReady} ready to review`, priority: 0 }
    case 'matching':
      return { kind: 'progress', label: 'Matching', priority: 1 }
    case 'defined':
      return { kind: 'setup', label: 'Ready to submit', priority: 2 }
    case 'being_defined':
      return {
        kind: 'setup',
        label: role.define_by === 'hiring_manager' ? 'Defining, hiring manager' : 'Defining, you',
        priority: 3,
      }
    case 'created':
      return { kind: 'setup', label: 'Draft', priority: 4 }
    case 'closed':
      return { kind: 'done', label: 'Closed', priority: 5 }
    default:
      return { kind: 'setup', label: ROLE_STATES[role.state] ?? role.state, priority: 4 }
  }
}

const PILL = {
  needs: 'bg-accent-soft text-strong font-semibold',
  progress: 'bg-info-soft text-info font-medium',
  setup: 'bg-ink/[0.05] text-secondary font-medium',
  done: 'bg-ink/[0.04] text-muted font-medium',
}
const DOT = {
  needs: 'bg-accent-dot',
  progress: 'bg-info',
  setup: 'bg-secondary/60',
  done: 'bg-muted',
}

/* Every status uses the same pill shape; colour and weight carry the kind. */
function RoleStatus({ meta }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] ${PILL[meta.kind]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[meta.kind]}`} aria-hidden="true" />
      {meta.label}
    </span>
  )
}

/* Consistent candidate summary, present on every row (never placeholder faces). */
function candidateSummary(role) {
  if (!role.totalCandidates) return 'No candidates yet'
  return `${role.totalCandidates} candidate${role.totalCandidates === 1 ? '' : 's'}`
}

function RoleRow({ role, onClick, muted = false }) {
  const meta = roleStatusMeta(role)
  const needs = meta.kind === 'needs'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-4 border-b border-hairline px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-background ${
        needs ? 'bg-accent-soft/25' : ''
      } ${muted ? 'opacity-70' : ''}`}
    >
      {/* The actionable role gets a green left bar so the eye lands here first */}
      {needs && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-accent-dot" />}

      {/* Title */}
      <div className="min-w-0 flex-1">
        <div className={`truncate text-[15px] font-medium ${muted ? 'text-secondary' : 'text-ink'}`}>
          {role.title}
        </div>
        <div className="truncate text-[13px] text-muted">
          {role.location} · {role.type}
        </div>
      </div>

      {/* Candidate summary — consistent across rows */}
      <div className="hidden w-[150px] shrink-0 text-[13px] text-secondary sm:block">
        {candidateSummary(role)}
      </div>

      {/* Status pill */}
      <div className="flex w-[190px] shrink-0 justify-end">
        <RoleStatus meta={meta} />
      </div>

      <ChevronRightIcon className={`h-4 w-4 shrink-0 ${muted ? 'text-muted' : 'text-secondary'}`} />
    </button>
  )
}

/**
 * RolesScreen — the recruiter's roles, ordered by what needs them. Ready-to-review
 * roles lead and stand out; matching and setup follow; closed roles sit in their
 * own de-emphasised section so the active list stays focused.
 */
export default function RolesScreen({ roles, onCreateRole, onOpenRole, defineNotice }) {
  const [loading, setLoading] = useState(true)
  const [noticeOpen, setNoticeOpen] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 850)
    return () => clearTimeout(t)
  }, [])

  const empty = !loading && roles.length === 0
  const readyCount = roles.filter((r) => r.candidatesReady > 0).length

  const active = roles
    .filter((r) => r.state !== 'closed')
    .sort((a, b) => roleStatusMeta(a).priority - roleStatusMeta(b).priority)
  const closed = roles.filter((r) => r.state === 'closed')

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Mobile-only header */}
      <header className="flex h-14 shrink-0 items-center border-b border-hairline px-5 lg:hidden">
        <span className="font-semibold tracking-tight text-ink">Azisly Recruit</span>
      </header>

      {/* Page header — title, live counts, and the primary Create action */}
      <div className="shrink-0 px-6 pb-5 pt-8 lg:px-8">
        <PageHeader
          breadcrumb={['Workspace', 'Roles']}
          title="Roles"
          stats={
            !loading && !empty
              ? [
                  { n: roles.length, label: roles.length === 1 ? 'role' : 'roles' },
                  { n: readyCount, label: 'with candidates ready' },
                ]
              : undefined
          }
          actions={
            !empty && (
              <Button onClick={onCreateRole}>
                <PlusIcon className="h-4 w-4" />
                New role
              </Button>
            )
          }
        />
      </div>

      {empty ? (
        <EmptyState onCreateRole={onCreateRole} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 lg:px-8">
          {/* A hiring manager finished a definition — a dismissible notification */}
          {defineNotice && noticeOpen && (
            <div className="mb-4 flex flex-wrap items-center gap-4 rounded-card border border-hairline bg-surface px-5 py-3.5 shadow-card">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-strong">
                <CheckIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink">
                  <span className="font-medium">{defineNotice.manager}</span> defined {defineNotice.roleTitle}
                </p>
                <p className="text-[13px] text-secondary">Ready to submit for matching · just now</p>
              </div>
              {defineNotice.onReview && <Button onClick={defineNotice.onReview}>Review and submit</Button>}
              <button
                type="button"
                onClick={() => setNoticeOpen(false)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-lg p-1.5 text-secondary transition-colors hover:bg-background hover:text-ink"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {loading ? (
            <div className="overflow-hidden rounded-card border border-hairline bg-surface shadow-card">
              <div className="animate-pulse divide-y divide-hairline">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-card border border-hairline bg-surface shadow-card">
                {active.map((r) => (
                  <RoleRow key={r.id} role={r} onClick={() => onOpenRole(r)} />
                ))}
              </div>

              {/* Closed roles, de-emphasised and out of the active flow */}
              {closed.length > 0 && (
                <div className="mt-7">
                  <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Closed · {closed.length}
                  </p>
                  <div className="overflow-hidden rounded-card border border-hairline bg-background/60">
                    {closed.map((r) => (
                      <RoleRow key={r.id} role={r} onClick={() => onOpenRole(r)} muted />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
