export const DAY_NAMES = {
  1: 'ראשון',
  2: 'שני',
  3: 'שלישי',
  4: 'רביעי',
  5: 'חמישי',
  6: 'שישי',
  7: 'שבת',
}

const WEEKDAY_TO_NUMBER = { Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6, Sat: 7 }

// 1 = Sunday ... 7 = Saturday, by Israel time (same as the server), not the browser's time zone
export function getTodayDayOfWeek() {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    weekday: 'short',
  }).format(new Date())
  return WEEKDAY_TO_NUMBER[weekday]
}
