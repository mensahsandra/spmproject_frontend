const LETTERS = [
  'A+','A','A-','B+','B','B-','C+','C','C-','D+','D','E','F'
];

export function normalizeGrade(input: string): string {
  const t = (input || '').trim().toUpperCase();
  // allow numbers 0-100
  const n = Number(t);
  if (!isNaN(n) && n >= 0 && n <= 100) return String(Math.round(n));
  // allow letter formats like a, a-, b+
  if (LETTERS.includes(t)) return t;
  return t; // keep raw; validation will flag invalid
}

export function isValidGrade(input: string): boolean {
  const t = (input || '').trim().toUpperCase();
  const n = Number(t);
  if (!isNaN(n) && n >= 0 && n <= 100) return true;
  return LETTERS.includes(t);
}
