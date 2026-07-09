import { Card } from '../components'
import { CopyNeeded, FixtureTag } from '../components/Spec.jsx'

/*
 * SubmitPeripheralScreen — the peripheral gap outcome.
 *
 * The unmapped part is a non-gate skill or a minor signal, so matching runs on
 * everything mapped and candidates appear immediately: no wait, and no mention of
 * ops. This build does not carry the candidate list, so the list itself is a
 * COPY NEEDED / component slot — the point of this state is only that there is NO
 * wait screen and NO ops language between Submit and candidates.
 */
export default function SubmitPeripheralScreen({ roleTitle = '', titleIsFixture = false }) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="flex shrink-0 items-center gap-2 border-b border-hairline bg-surface px-6 py-4 lg:px-8">
        <h1 className="truncate text-lg font-semibold text-ink">{roleTitle}</h1>
        {titleIsFixture && <FixtureTag />}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {/* No wait, no ops mention — the candidate list simply renders. That list
              is a downstream component (Matching PRD); here it is a slot. */}
          <Card className="flex flex-col items-center gap-3 p-10 text-center">
            <CopyNeeded note="candidate list — renders immediately, no wait, no ops language" />
            <p className="text-[13px] text-secondary">
              <CopyNeeded note="candidate list component belongs to the Matching PRD" />
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
