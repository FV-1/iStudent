/** Minuscules sans accents, pour comparer des saisies utilisateur. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Vrai si l'un des champs contient la requête (insensible casse/accents). */
export function matchesQuery(fields: (string | undefined)[], query: string): boolean {
  const needle = normalizeText(query.trim());
  if (!needle) {
    return true;
  }
  return fields.some((field) => field && normalizeText(field).includes(needle));
}
