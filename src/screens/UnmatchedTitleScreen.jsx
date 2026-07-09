import { Button, Card } from '../components'
import { CopyNeeded, FixtureTag } from '../components/Spec.jsx'
import { ArrowLeftIcon, CheckIcon } from '../components/icons.jsx'
import { guessFamily, FAMILY_NAMES } from '../data/roleFamilies.js'
import { track } from '../lib/analytics.js'

/*
 * UnmatchedTitleScreen — the title matched no family.
 *
 * We never render a blank domain and never render the string null. Instead we
 * name the closest family as a guess (a stub ranking, see roleFamilies.js), offer
 * the other ten in a list, and offer "none of these". Picking "none of these"
 * logs role_flagged_to_ops with gap load_bearing: no family means the gates and
 * the domain are unknown, which is load-bearing, not peripheral.
 */
export default function UnmatchedTitleScreen({ title = '', titleIsFixture = false, onPick, onNoneOfThese, onBack }) {
  const guess = guessFamily(title)
  const others = FAMILY_NAMES.filter((n) => n !== guess.name)

  const pick = (name) => {
    track('role_probing_shown', { reason: 'family_confirmation', title, picked: name })
    onPick?.(name)
  }
  const noneOfThese = () => {
    track('role_flagged_to_ops', { gap: 'load_bearing', title })
    onNoneOfThese?.()
  }

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="flex shrink-0 items-center gap-3 border-b border-hairline bg-surface px-6 py-4 lg:px-8">
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
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-secondary">
            <CopyNeeded note="unmatched eyebrow" />
          </p>
          <h1 className="flex items-center gap-2 truncate text-xl font-bold text-ink">
            {title}
            {titleIsFixture && <FixtureTag />}
          </h1>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
          <p className="text-sm text-secondary">
            <CopyNeeded note="explain: no family matched, confirm the closest" />
          </p>

          {/* The guess — a real family name (authored). Never a blank domain. */}
          <Card className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                <CopyNeeded note="closest-guess label" />
              </p>
            </div>
            <button
              type="button"
              onClick={() => pick(guess.name)}
              className="flex items-center justify-between rounded-lg border border-accent bg-accent-soft/40 px-4 py-3 text-left transition-colors hover:bg-accent-soft"
            >
              <div>
                <div className="text-sm font-semibold text-ink">{guess.name}</div>
                <div className="text-[13px] text-secondary">{guess.domainCompetency}</div>
              </div>
              <span className="text-accent">
                <CheckIcon className="h-4 w-4" />
              </span>
            </button>
          </Card>

          {/* The other ten. */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              <CopyNeeded note="other-families label" />
            </p>
            <div className="flex flex-col gap-1.5">
              {others.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => pick(name)}
                  className="rounded-lg border border-hairline bg-surface px-4 py-2.5 text-left text-sm text-ink shadow-card transition-colors hover:border-ink/20"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* "none of these" — authored copy from the build brief. Logs the ops flag. */}
          <Button variant="secondary" onClick={noneOfThese} className="self-start">
            none of these
          </Button>
        </div>
      </div>
    </div>
  )
}
