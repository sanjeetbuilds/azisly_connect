import Button from './Button.jsx'

/**
 * ConfirmDialog — the reference's confirm pattern (same shape as the existing
 * reject dialog): a dimmed backdrop, a centred card, Cancel plus one confirm
 * action. `tone: 'danger'` is for a destructive, irreversible confirm; the
 * default tone is for a consequential but non-destructive one. An optional
 * unstructured feedback field can be attached (used by Close).
 */
export default function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'default',
  feedback,
  onCancel,
  onConfirm,
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 z-40 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[1px]"
      />
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in-up rounded-card border border-hairline bg-surface p-6 shadow-overlay">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-secondary">{message}</p>
          {feedback && (
            <textarea
              value={feedback.value}
              onChange={(e) => feedback.onChange(e.target.value)}
              placeholder={feedback.placeholder ?? 'Optional feedback'}
              rows={3}
              className="mt-4 w-full resize-none rounded-lg border border-hairline bg-background px-3 py-2.5 text-sm leading-relaxed text-ink placeholder:text-muted focus:border-ink/25 focus:outline-none"
            />
          )}
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
            {tone === 'danger' ? (
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-danger px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                {confirmLabel}
              </button>
            ) : (
              <Button onClick={onConfirm}>{confirmLabel}</Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
