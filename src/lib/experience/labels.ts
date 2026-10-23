/* Office pill: companies drop their legal suffix and the SET note. */
export const officeLabel = (company: string) =>
  company
    .replace(/\([^)]*\)/g, '')
    .replace(/(Co\.,?|Ltd\.,?|Company|Co\b)/gi, '')
    .replace(/[^A-Za-z0-9 .&-]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join(' ');

/* Display-only: the run periods read better with a real dash on the rail. */
export const railPeriod = (period: string) => period.replace(/\s+-\s+/g, ' — ');
