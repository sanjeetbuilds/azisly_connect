/* Shared brand mark across every auth screen (Sign in, Set Password, Reset
   Password, expired-link) so the whole flow reads as one family. */
export default function Wordmark({ className = '' }) {
  return (
    <span className={`font-semibold tracking-tight text-ink ${className}`}>
      Azisly <span className="text-secondary">Recruit</span>
    </span>
  )
}
