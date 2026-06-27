import Kbd from './Kbd.jsx'
import { SearchIcon } from './icons.jsx'

/**
 * SearchInput — a working search field with a leading icon and a ⌘K hint.
 * Focus uses the functional accent.
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search candidates…',
  className = '',
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <span className="pointer-events-none absolute left-3 text-secondary">
        <SearchIcon className="h-4 w-4" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-hairline bg-surface py-2 pl-9 pr-12 text-sm text-ink shadow-card transition-colors placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
      />
      <Kbd className="absolute right-2.5">⌘K</Kbd>
    </div>
  )
}
