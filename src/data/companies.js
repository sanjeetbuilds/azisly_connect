// The companies hosting interviews on Azisly. A magic-link token carries a
// companyId, which resolves here in any fresh tab with no shared app state.
export const companies = [
  { id: 'acme', name: 'Acme' },
]

export const companyById = (id) => companies.find((c) => c.id === id) ?? companies[0]
