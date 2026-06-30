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

export const PlusIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.6" className={className}>
    <path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" />
  </svg>
)

export const MinusIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.6" className={className}>
    <path d="M3.5 8h9" strokeLinecap="round" />
  </svg>
)

export const ArrowLeftIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.5" className={className}>
    <path d="M10 3.5L5.5 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SendIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.5" className={className}>
    <path d="M8 13V4M4.5 7.5L8 4l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PaperclipIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <path
      d="M12.3 7.4l-4.5 4.5a2.4 2.4 0 0 1-3.4-3.4l4.8-4.8a1.5 1.5 0 0 1 2.2 2.2L6.6 10.7a.7.7 0 0 1-1-1l4.3-4.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/* AI spark — filled. */
export const SparkleIcon = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M8 1l1.3 3.6a3 3 0 0 0 1.6 1.6L14.5 7.5 11 8.8a3 3 0 0 0-1.6 1.6L8 14l-1.3-3.6a3 3 0 0 0-1.6-1.6L1.5 7.5 5 6.2a3 3 0 0 0 1.6-1.6L8 1z" />
  </svg>
)

export const ChevronRightIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.5" className={className}>
    <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const MailIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" />
    <path d="M3 5l5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PhoneIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <path
      d="M4 2.8l1.7.3.9 2.3-1.2 1c.5 1.2 1.5 2.2 2.7 2.7l1-1.2 2.3.9.3 1.7c0 .6-.5 1-1 1C6.3 12.2 3.8 9.7 3 4c0-.6.4-1.1 1-1.2z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const LinkIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <path d="M6.6 9.4l2.8-2.8" strokeLinecap="round" />
    <path d="M7.2 4.6l1-1a2.4 2.4 0 0 1 3.4 3.4l-1 1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.8 11.4l-1 1a2.4 2.4 0 0 1-3.4-3.4l1-1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ClockIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <circle cx="8" cy="8" r="5.5" />
    <path d="M8 5v3.2l2 1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const MicIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <rect x="6" y="2" width="4" height="7.5" rx="2" />
    <path d="M3.8 7.6a4.2 4.2 0 0 0 8.4 0" strokeLinecap="round" />
    <path d="M8 11.8V14M6 14h4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* Filled play triangle — interview video poster. */
export const PlayIcon = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M5 3.4l8 4.6-8 4.6z" />
  </svg>
)

/* Chat bubble — used for the chat/voice mode toggle. */
export const ChatIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <path
      d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v4A1.5 1.5 0 0 1 11.5 10H6l-2.5 2.2V10A1.5 1.5 0 0 1 3 8.5z"
      strokeLinejoin="round"
    />
  </svg>
)

export const CameraIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <rect x="2" y="4.5" width="8.5" height="7" rx="1.5" />
    <path d="M10.5 7l3.5-2v6l-3.5-2z" strokeLinejoin="round" />
  </svg>
)

export const ShieldIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <path d="M8 2l4.5 1.7v3.5c0 3-2 5.3-4.5 6.3-2.5-1-4.5-3.3-4.5-6.3V3.7L8 2z" strokeLinejoin="round" />
  </svg>
)

export const EyeIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <path d="M1.8 8s2.4-4 6.2-4 6.2 4 6.2 4-2.4 4-6.2 4-6.2-4-6.2-4z" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.7" />
  </svg>
)

export const SmileIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...base} strokeWidth="1.4" className={className}>
    <circle cx="8" cy="8" r="5.8" />
    <path d="M5.6 9.4c.7.8 4.1.8 4.8 0" strokeLinecap="round" />
    <circle cx="6.1" cy="6.6" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="9.9" cy="6.6" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)
