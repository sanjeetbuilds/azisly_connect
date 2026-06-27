/**
 * Button — the primary action vocabulary.
 *
 * primary   : solid ink, white text, pill, no shadow, slight darken on hover.
 * secondary : white pill, hairline border, ink text.
 *
 * Rule: never present two buttons as equal weight. A view has one primary;
 * everything else is secondary.
 */
export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 ' +
    'text-sm font-medium leading-none transition-colors duration-150 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
    'disabled:opacity-40 disabled:pointer-events-none select-none'

  const variants = {
    primary: 'bg-ink text-surface hover:bg-ink-hover',
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
