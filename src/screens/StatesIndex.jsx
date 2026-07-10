import { Link, useNavigate, useParams } from 'react-router-dom'
import { FixtureTag } from '../components/Spec.jsx'
import DefineRoleScreen from './DefineRoleScreen.jsx'
import ReviewRoleScreen from './ReviewRoleScreen.jsx'
import SubmitPeripheralScreen from './SubmitPeripheralScreen.jsx'
import MagicLinkScreen from './MagicLinkScreen.jsx'
import { DEMO_ROLE_TITLE, DEMO_VOICE_ANSWERS } from '../data/fixtures.js'

// Answers already given by voice — the "conversed" demo states.
const VOICE_ANSWERS = DEMO_VOICE_ANSWERS.map((text) => ({ text, fixture: true }))

/*
 * /states — a click-through index of every state this build defines, reachable
 * with no data setup. Each state is a real screen rendered with fixture inputs.
 * Every fixture value carries a FixtureTag on screen.
 */

function Full({ children }) {
  return <div className="flex h-screen overflow-hidden">{children}</div>
}

// id → { group, label, element(navigate) }
const STATES = {
  'define-matched': {
    group: 'Define',
    label: 'Title matched',
    render: () => (
      <Full>
        <DefineRoleScreen roleTitle={DEMO_ROLE_TITLE} titleIsFixture onAskManager={() => {}} onComplete={() => {}} />
      </Full>
    ),
  },
  'define-resumed': {
    group: 'Define',
    label: 'Resumed, part filled',
    render: () => (
      <Full>
        <DefineRoleScreen
          roleTitle={DEMO_ROLE_TITLE}
          titleIsFixture
          initialAnswers={VOICE_ANSWERS.slice(0, 2)}
          onComplete={() => {}}
        />
      </Full>
    ),
  },
  'define-answered': {
    group: 'Define',
    label: 'Answered, three probes',
    render: () => (
      <Full>
        <DefineRoleScreen roleTitle={DEMO_ROLE_TITLE} titleIsFixture initialAnswers={VOICE_ANSWERS} onComplete={() => {}} />
      </Full>
    ),
  },
  'define-data-analyst': {
    group: 'Define',
    label: 'Data Analyst (authored)',
    render: () => (
      <Full>
        <DefineRoleScreen roleTitle="Data Analyst" titleIsFixture onComplete={() => {}} />
      </Full>
    ),
  },
  'define-jd-landed': {
    group: 'JD',
    label: 'JD landed, two probes',
    render: () => (
      <Full>
        <DefineRoleScreen roleTitle={DEMO_ROLE_TITLE} titleIsFixture initialJdStage="landed" onComplete={() => {}} />
      </Full>
    ),
  },
  'review-complete': {
    group: 'Review',
    label: 'Card complete — Submit enabled',
    render: () => (
      <Full>
        {/* Product Manager is authored, so its real card is complete. */}
        <ReviewRoleScreen roleTitle={DEMO_ROLE_TITLE} onSubmit={() => {}} />
      </Full>
    ),
  },
  'submit-peripheral': {
    group: 'Submit',
    label: 'Peripheral gap — candidates immediately',
    render: () => (
      <Full>
        <SubmitPeripheralScreen roleTitle={DEMO_ROLE_TITLE} titleIsFixture />
      </Full>
    ),
  },
  'link-valid': {
    group: 'Magic link',
    label: 'Valid',
    render: (nav) => (
      <MagicLinkScreen
        variant="valid"
        roleTitle={DEMO_ROLE_TITLE}
        titleIsFixture
        onStart={() => nav('/states/define-matched')}
      />
    ),
  },
  'link-expired-open': {
    group: 'Magic link',
    label: 'Expired on open',
    render: () => <MagicLinkScreen variant="expired" />,
  },
  'link-expired-paused': {
    group: 'Magic link',
    label: 'Expired while paused',
    render: () => <MagicLinkScreen variant="expiredPaused" />,
  },
}

const GROUP_ORDER = ['Define', 'JD', 'Voice', 'Review', 'Submit', 'Magic link']

export default function StatesIndex() {
  const { id } = useParams()
  const navigate = useNavigate()

  if (id && STATES[id]) {
    return (
      <div className="relative">
        <Link
          to="/states"
          className="fixed left-3 top-3 z-50 rounded-md border border-hairline bg-surface/95 px-2.5 py-1 text-[12px] font-medium text-secondary shadow-card backdrop-blur hover:text-ink"
        >
          ← states
        </Link>
        {STATES[id].render(navigate)}
      </div>
    )
  }

  const groups = GROUP_ORDER.map((g) => ({
    group: g,
    items: Object.entries(STATES).filter(([, s]) => s.group === g),
  }))

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-ink">Create &amp; Define — states</h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-secondary">
          Every state below is reachable with no data setup. Inputs are fixtures. <FixtureTag />
        </p>
        <div className="mt-8 flex flex-col gap-8">
          {groups.map(({ group, items }) => (
            <section key={group} className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{group}</p>
              <div className="flex flex-col gap-1.5">
                {items.map(([sid, s]) => (
                  <Link
                    key={sid}
                    to={`/states/${sid}`}
                    className="flex items-center justify-between rounded-lg border border-hairline bg-surface px-4 py-3 text-sm text-ink shadow-card transition-colors hover:border-ink/20"
                  >
                    <span>{s.label}</span>
                    <span className="font-mono text-[12px] text-muted">{sid}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
