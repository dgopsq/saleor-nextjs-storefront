/**
 *
 */
export function formatDateFull(date: Date, locale: string = "en-US"): string {
  return new Intl.DateTimeFormat(locale).format(date);
}
