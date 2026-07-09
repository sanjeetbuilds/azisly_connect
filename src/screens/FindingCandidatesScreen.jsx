import { Button } from '../components'
import { CopyNeeded, FixtureTag } from '../components/Spec.jsx'

/*
 * FindingCandidatesScreen — the load-bearing gap wait.
 *
 * The unmapped part is load-bearing (a gate or the domain), so partial results
 * would rank against a broken bar. The role sits on a calm waiting state. No
 * spinner. No percentage. No "under review". The recruiter can leave the screen;
 * the role shows the same state in their list ("Finding candidates").
 */
export default function FindingCandidatesScreen({ roleTitle = '', titleIsFixture = false, onLeave }) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-hairline bg-surface px-6 py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-lg font-semibold text-ink">{roleTitle}</h1>
          {titleIsFixture && <FixtureTag />}
        </div>
        {/* The recruiter is not made to wait here. */}
        <Button variant="secondary" onClick={onLeave}>
          <CopyNeeded note="leave / back-to-roles CTA" />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-6">
        <div className="max-w-md text-center">
          {/* Verbatim PRD. Nothing else. No spinner, no percentage, no status chip. */}
          <p className="text-lg leading-relaxed text-ink">
            Finding candidates. We&rsquo;ll let you know the moment they&rsquo;re ready.
          </p>
        </div>
      </div>

      {/* The list-row echo: the same role shows the same state in the roles list. */}
      <div className="shrink-0 border-t border-hairline bg-surface px-6 py-3 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between rounded-lg border border-hairline bg-background px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm text-ink">
            {roleTitle}
            {titleIsFixture && <FixtureTag />}
          </span>
          {/* "Finding candidates" as the list status is verbatim PRD. */}
          <span className="text-[13px] text-secondary">Finding candidates</span>
        </div>
      </div>
    </div>
  )
}
