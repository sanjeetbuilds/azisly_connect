// The signed-in recruiter's own account and company profile (C1). Single
// seed record for the prototype — there is one recruiter per company, same
// as the rest of this app's fixtures (see workspace in candidates.js).
//
// company.legalName and verificationDocument are locked: set once during
// account verification (ops-side, O2) and never editable by the recruiter.
// Everything else on this record is editable from Profile & company.
export const RECRUITER_ACCOUNT = {
  name: 'Aryan Mehta',
  email: 'aryan@acme.com',
  password: 'password',
  phone: '+91 98450 11234',
  company: {
    legalName: 'Acme Technologies Pvt Ltd',
    website: 'acme.com',
    email: 'ops@acme.com',
  },
  verificationDocument: {
    name: 'Certificate of incorporation.pdf',
    uploadedAt: '2026-05-08T12:00:00Z',
  },
}
