// Shared password rules for Set Password and Reset Password (C1): minimum 8
// characters, at least one letter, at least one number. Rendered as a live
// checklist that updates as the recruiter types.
export const PASSWORD_RULES = [
  { key: 'length', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { key: 'letter', label: 'At least one letter', test: (pw) => /[a-zA-Z]/.test(pw) },
  { key: 'number', label: 'At least one number', test: (pw) => /[0-9]/.test(pw) },
]

export const isPasswordValid = (pw) => PASSWORD_RULES.every((rule) => rule.test(pw))
