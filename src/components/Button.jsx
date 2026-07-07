/**
 * Button — the reference's action vocabulary.
 *
 * primary   : deep-green fill, white text, ~10px radius, medium weight.
 * secondary : white fill, hairline border, ink text.
 *
 * Rule: one primary per view; everything else is secondary.
 */
export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 ' +
    'text-sm font-medium leading-none transition-colors duration-150 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
    'disabled:opacity-40 disabled:pointer-events-none select-none'

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    secondary: 'bg-surface text-ink border border-hairline hover:bg-background',
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
