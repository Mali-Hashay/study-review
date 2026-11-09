const DAY_MS = 24 * 60 * 60 * 1000

export function describeLastReviewed(lastReviewedAt) {
  if (!lastReviewedAt) return 'עוד לא תורגל'

  const days = Math.floor((Date.now() - new Date(lastReviewedAt).getTime()) / DAY_MS)
  if (days <= 0) return 'תורגל היום'
  if (days === 1) return 'תורגל אתמול'
  if (days < 14) return `תורגל לפני ${days} ימים`
  const weeks = Math.floor(days / 7)
  return `תורגל לפני ${weeks} שבועות`
}
