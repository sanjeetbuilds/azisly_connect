// STUB — analytics. The real system sends these to the product analytics sink.
// Here it logs to the console so the events are observable with no backend.
// Event names are the PRD's verbatim (role_define_started, role_flagged_to_ops, …).
export function track(event, props = {}) {
  if (typeof console !== 'undefined') console.log('[analytics]', event, props)
}
