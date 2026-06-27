/**
 * Kbd — a small keyboard-shortcut chip (e.g. ⌘K). A bit of working-software
 * furniture, like the shortcut hints in Linear/Prysm.
 */
export default function Kbd({ children, className = '' }) {
  return (
    <kbd
      className={`inline-flex h-5 items-center justify-center rounded border border-hairline bg-background px-1.5 font-sans text-[11px] font-medium text-secondary ${className}`}
    >
      {children}
    </kbd>
  )
}
