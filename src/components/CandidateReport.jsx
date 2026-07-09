import { useMemo, useState } from 'react'
import Button from './Button.jsx'
import Avatar from './Avatar.jsx'
import VerdictTag from './VerdictTag.jsx'
import { ScoreValue } from './Scores.jsx'
import { LinkIcon, MailIcon, DownloadIcon, XIcon, CheckIcon } from './icons.jsx'
import { reportModel } from '../lib/reportData.js'
import { reportLink, downloadReport } from '../lib/exports.js'

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{children}</p>
)

// One ladder colour per rung, matching every other screen.
const RUNG_BAR = {
  mustHave: 'bg-danger',
  veryImportant: 'bg-attention',
  domain: 'bg-ink',
  baseline: 'bg-secondary/40',
}
const NOTE = { fail: 'text-danger font-semibold', warn: 'text-attention font-medium', ok: 'text-strong font-medium', muted: 'text-muted' }
const SCORE = { fail: 'text-danger', warn: 'text-attention', ok: 'text-ink', muted: 'text-ink' }

function RecMarker({ tone }) {
  if (tone === 'fail') {
    return (
      <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
        <XIcon className="h-2.5 w-2.5" />
      </span>
    )
  }
  if (tone === 'warn') return <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-attention" aria-hidden="true" />
  return (
    <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
      <CheckIcon className="h-2.5 w-2.5" />
    </span>
  )
}

/**
 * CandidateReport — the shareable artifact, distinct from the fast decision panel.
 * The verdict, the forward actions, every competency with the evidence behind its
 * score, and the criteria the recruiter set (their own words included). Written to
 * be forwarded to a hiring manager who was not in the loop. Header actions to
 * share, email, or download are always present.
 */
export default function CandidateReport({ candidate, onClose }) {
  const m = useMemo(() => reportModel(candidate), [candidate])
  const [copied, setCopied] = useState(false)

  const share = async () => {
    try {
      await navigator.clipboard.writeText(reportLink(candidate))
    } catch {
      /* clipboard may be unavailable; the link is still the shareable URL */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const mailto = `mailto:?subject=${encodeURIComponent(`Candidate report: ${m.name}`)}&body=${encodeURIComponent(
    `${m.name} for ${m.role}\nVerdict: ${m.reco}\nInterview score: ${m.score ?? 'n/a'}\n\nFull report: ${reportLink(candidate)}`,
  )}`

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/30 p-4 backdrop-blur-[1px] sm:p-8">
      <div className="my-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-card border border-hairline bg-surface shadow-overlay">
        {/* Header actions, always visible */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-hairline bg-surface px-5 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Candidate report</span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="secondary" onClick={share} className="!px-3 !py-1.5 !text-[13px]">
              <LinkIcon className="h-3.5 w-3.5" />
              {copied ? 'Link copied' : 'Share link'}
            </Button>
            <a
              href={mailto}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-hairline bg-surface px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:bg-background"
            >
              <MailIcon className="h-3.5 w-3.5" />
              Email
            </a>
            <Button variant="secondary" onClick={() => downloadReport(candidate)} className="!px-3 !py-1.5 !text-[13px]">
              <DownloadIcon className="h-3.5 w-3.5" />
              Download report
            </Button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close report"
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-secondary transition-colors hover:border-ink/30 hover:text-ink"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-7 px-6 py-6 sm:px-8">
          {/* Identity + verdict */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Avatar name={m.name} size={52} />
              <div>
                <h2 className="text-xl font-bold text-ink">{m.name}</h2>
                <p className="text-sm text-secondary">{m.role}</p>
                {m.experience && <p className="text-[13px] text-muted">{m.experience}</p>}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Interview</span>
              <div className="flex items-center gap-2">
                <ScoreValue value={m.score} size="xl" />
                {m.verdict && <VerdictTag verdict={m.verdict} />}
              </div>
              <span className="text-[12px] text-muted">Match {m.match}</span>
            </div>
          </div>

          <p className="text-sm font-medium text-ink">{m.reco}</p>

          {/* What to do next */}
          <section className="flex flex-col gap-3">
            <SectionLabel>What to do next</SectionLabel>
            <ul className="flex flex-col gap-2.5">
              {m.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink">
                  <RecMarker tone={r.tone} />
                  {r.text}
                </li>
              ))}
            </ul>
          </section>

          {/* Competencies with the evidence behind each score */}
          <section className="flex flex-col gap-4">
            <SectionLabel>Competencies and evidence</SectionLabel>
            <div className="flex flex-col divide-y divide-hairline">
              {m.competencies.map((c) => (
                <div key={c.name} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-3.5 w-[3px] shrink-0 rounded-full ${RUNG_BAR[c.rung]}`} aria-hidden="true" />
                    <span className="flex-1 text-sm text-ink">{c.name}</span>
                    <span className={`text-sm font-semibold tabular-nums ${SCORE[c.tone]}`}>{c.score}</span>
                    <span className={`w-[112px] shrink-0 text-right text-[12px] ${NOTE[c.tone]}`}>{c.note}</span>
                  </div>
                  {c.phrase && (
                    <p className="pl-[13px] text-[12px] text-secondary">
                      You asked to test <span className="text-ink">&ldquo;{c.phrase}&rdquo;</span>, scored here.
                    </p>
                  )}
                  {c.evidence && (
                    <div className="ml-[13px] rounded-lg border border-hairline bg-background px-3 py-2.5">
                      <p className="text-[13px] leading-relaxed text-ink">&ldquo;{c.evidence.quote}&rdquo;</p>
                      {c.evidence.source && <p className="mt-1 text-[12px] text-secondary">{c.evidence.source}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* The criteria the recruiter set, so a manager sees what it was judged on */}
          <section className="flex flex-col gap-3 rounded-card border border-hairline bg-background/60 p-4">
            <SectionLabel>Assessed against the criteria you set</SectionLabel>
            <div className="flex flex-col gap-1.5 text-[13px] text-secondary">
              {m.criteria.domain && (
                <p>
                  <span className="text-ink">Domain:</span> {m.criteria.domain}
                </p>
              )}
              <p>
                <span className="text-ink">Very important:</span>{' '}
                {m.criteria.emphasis.join(', ') || 'none named'}
              </p>
              <p>
                <span className="text-ink">Must have (gates):</span> {m.criteria.gates.join(', ')}
              </p>
              {Object.entries(m.criteria.probes).map(([k, v]) => (
                <p key={k}>
                  <span className="text-ink">Your words:</span> &ldquo;{v}&rdquo; tested under {k}
                </p>
              ))}
            </div>
          </section>

          {/* Contact, for the offline rounds the recruiter runs next */}
          <section className="flex flex-col gap-2">
            <SectionLabel>Contact</SectionLabel>
            <div className="flex flex-col gap-1 text-sm text-ink">
              <span className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-secondary" />
                {m.contacts.email}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-4 w-4" />
                {m.contacts.phone}
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
