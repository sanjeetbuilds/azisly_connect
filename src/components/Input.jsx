import { useId } from 'react'

/**
 * Input — clean and quiet. A light hairline border that settles to ink on
 * focus. A tiny uppercase mono label sits above it for metadata.
 */
export default function Input({
  label,
  id,
  className = '',
  hint,
  ...props
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] uppercase tracking-[0.12em] font-mono text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={
          'w-full bg-transparent border-b border-hairline px-0.5 py-2 ' +
          'text-[15px] text-ink placeholder:text-secondary/60 ' +
          'focus:outline-none focus:border-ink transition-colors duration-200 ' +
          className
        }
        {...props}
      />
      {hint && <span className="text-xs text-secondary">{hint}</span>}
    </div>
  )
}
