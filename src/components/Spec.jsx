// Specification primitives.
//
// This repo is a design spec. Where a user-facing string is not yet written, we
// do not invent one — we render a loud red flag so the gap is impossible to miss
// and impossible to ship by accident.
//
//   <CopyNeeded>      a user-facing string the PRD does not supply
//   <AuthoringNeeded> an authored array (criteria) that ships empty
//   <FixtureTag>      marks any content that came from data/fixtures.js as fake

export function CopyNeeded({ note }) {
  return (
    <span className="inline-flex items-center rounded border border-danger/40 bg-danger-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-danger">
      COPY NEEDED{note ? <span className="ml-1 font-medium normal-case opacity-70">· {note}</span> : null}
    </span>
  )
}

export function AuthoringNeeded({ note }) {
  return (
    <span className="inline-flex items-center rounded border border-danger/40 bg-danger-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-danger">
      AUTHORING NEEDED{note ? <span className="ml-1 font-medium normal-case opacity-70">· {note}</span> : null}
    </span>
  )
}

// A 10px muted inline label at the end of the line it belongs to. Never a filled
// pill, never the most visible thing in its row.
export function FixtureTag({ className = '' }) {
  return (
    <span
      className={`text-[10px] text-muted ${className}`}
      title="Sample content from data/fixtures.js — not real"
    >
      fixture
    </span>
  )
}
