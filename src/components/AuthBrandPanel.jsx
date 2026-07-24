import Wordmark from './Wordmark.jsx'
import { CheckIcon } from './icons.jsx'

const FEATURES = [
  'Structured interviews, scored consistently.',
  'Every verdict backed by evidence.',
  'From sourced to decided in one place.',
]

/* Shared left brand panel for every full-screen auth flow (Sign in, Set
   Password, Reset Password, expired link) so the whole flow reads as one
   family, not a set of one-off screens. */
export default function AuthBrandPanel() {
  return (
    <div className="relative hidden w-[44%] flex-col justify-between border-r border-hairline p-12 lg:flex">
      <Wordmark className="text-lg" />
      <div className="flex max-w-sm flex-col gap-7">
        <h2 className="text-[28px] font-bold leading-snug text-ink">
          Hiring decisions, judged on evidence.
        </h2>
        <ul className="flex flex-col gap-3.5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-secondary">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CheckIcon className="h-3 w-3" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-secondary">© Azisly</p>
    </div>
  )
}
