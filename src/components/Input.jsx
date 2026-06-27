import { useId } from 'react'

/**
 * Input — clean and quiet. A light hairline border that settles to ink on
 * focus. A small sentence-case grey label sits above it. Pass `error` (a
 * string) to show an inline red helper line and a red underline.
 */
export default function Input({
  label,
  id,
  className = '',
  hint,
  error,
  ...props
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm text-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={
          'w-full bg-transparent border-b px-0.5 py-2 ' +
          'text-[15px] text-ink placeholder:text-secondary/60 ' +
          'focus:outline-none transition-colors duration-200 ' +
          (error ? 'border-error focus:border-error ' : 'border-hairline focus:border-ink ') +
          className
        }
        {...props}
      />
      {error ? (
        <span className="text-xs text-error">{error}</span>
      ) : (
        hint && <span className="text-xs text-secondary">{hint}</span>
      )}
    </div>
  )
}
