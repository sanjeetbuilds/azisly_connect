/* Small line icons — stroke = currentColor so they inherit text colour.
   Each accepts a className for sizing. */
const base = { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor' }

export const SearchIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.5" className={className}>
    <circle cx="7" cy="7" r="4.25" />
    <path d="M10.5 10.5L14 14" strokeLinecap="round" />
  </svg>
)

export const ChevronDownIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.5" className={className}>
    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CheckIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.8" className={className}>
    <path d="M3.5 8.5l2.8 2.8L12.5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ListIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.5" className={className}>
    <path d="M5.5 4.5h8M5.5 8h8M5.5 11.5h8" strokeLinecap="round" />
    <path d="M2.5 4.5h.01M2.5 8h.01M2.5 11.5h.01" strokeLinecap="round" strokeWidth="2" />
  </svg>
)

export const GridIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
  </svg>
)

export const XIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.5" className={className}>
    <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
  </svg>
)

/* Sort indicator: neutral up/down when inactive, single caret when active. */
export const SortIcon = ({ dir, className = 'h-3 w-3' }) => (
  <svg {...base} strokeWidth="1.5" className={className}>
    <path d="M5 6.5L8 3.5l3 3" strokeLinecap="round" strokeLinejoin="round" opacity={dir === 'desc' ? 0.25 : 1} />
    <path d="M5 9.5L8 12.5l3-3" strokeLinecap="round" strokeLinejoin="round" opacity={dir === 'asc' ? 0.25 : 1} />
  </svg>
)
