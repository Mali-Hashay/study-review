import { useEffect, useState } from 'react'
import { api } from '../api/api.js'
import forms from '../components/forms.module.css'
import { DAY_NAMES } from '../utils/days.js'
import styles from './ProgressPage.module.css'

const DAY_OPTIONS = [7, 14, 30, 60]
const DAY_MS = 24 * 60 * 60 * 1000

export function ProgressPage() {
  const [days, setDays] = useState(14)
  const [weekCategories, setWeekCategories] = useState(null)
  const [staleTopics, setStaleTopics] = useState(null)
  const [confidence, setConfidence] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api('/week'), api('/stats/topic-confidence')])
      .then(([week, stats]) => {
        setWeekCategories(week.categories)
        setConfidence(stats.topics)
      })
      .catch((err) => setError(err.message))
  }, [])

  // Reloads whenever the number of days changes
  useEffect(() => {
    api(`/stale-topics?days=${days}`)
      .then((data) => setStaleTopics(data.topics))
      .catch((err) => setError(err.message))
  }, [days])

  const reviewedThisWeek =
    weekCategories?.flatMap((category) => category.topics).filter((topic) => topic.reviewedThisWeek)
      .length ?? null

  return (
    <div className={styles.page}>
      <h1>ההתקדמות שלי</h1>
      {error && <p className={forms.error}>{error}</p>}

      <div className={styles.tiles}>
        <StatTile value={reviewedThisWeek} label="נושאים תורגלו השבוע" />
        <StatTile value={staleTopics?.length ?? null} label={`נושאים לא תורגלו ${days} ימים`} />
        <StatTile value={averageConfidence(confidence)} label="ביטחון ממוצע (מתוך 5)" />
      </div>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h2>על מה כדאי לחזור</h2>
          <label className={styles.daysPicker}>
            לא תורגל
            <select value={days} onChange={(event) => setDays(Number(event.target.value))}>
              {DAY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} ימים
                </option>
              ))}
            </select>
          </label>
        </header>
        <StaleTopics topics={staleTopics} />
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h2>רמת ביטחון לפי נושא</h2>
        </header>
        <TopicConfidence topics={confidence} />
      </section>
    </div>
  )
}

function StatTile({ value, label }) {
  return (
    <div className={`${styles.tile} lift`}>
      <span className={styles.tileValue}>{value ?? '–'}</span>
      <span className={styles.tileLabel}>{label}</span>
    </div>
  )
}

// Weighted by the number of reviews: a topic reviewed 10 times counts more than one reviewed once
function averageConfidence(topics) {
  if (!topics || topics.length === 0) return null
  const totalReviews = topics.reduce((sum, topic) => sum + topic.reviewCount, 0)
  const weightedSum = topics.reduce((sum, topic) => sum + topic.avgConfidence * topic.reviewCount, 0)
  return Math.round((weightedSum / totalReviews) * 10) / 10
}

// The server sends a flat list; group it by category, ordered by day
function groupByCategory(topics) {
  const groups = new Map()
  for (const topic of topics) {
    if (!groups.has(topic.categoryId)) {
      groups.set(topic.categoryId, {
        id: topic.categoryId,
        name: topic.categoryName,
        dayOfWeek: topic.dayOfWeek,
        topics: [],
      })
    }
    groups.get(topic.categoryId).topics.push(topic)
  }
  return [...groups.values()].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
}

function daysSince(date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / DAY_MS)
}

function StaleTopics({ topics }) {
  if (!topics) return <p className={styles.muted}>טוען...</p>
  if (topics.length === 0) return <p className={styles.muted}>כל הכבוד! אין נושאים שהוזנחו 🎉</p>

  return (
    <div className={styles.groups}>
      {groupByCategory(topics).map((category) => (
        <div key={category.id} className={`${styles.group} lift`}>
          <h3>
            {category.name} <span className={styles.muted}>· {DAY_NAMES[category.dayOfWeek]}</span>
          </h3>
          <ul className={styles.tags}>
            {category.topics.map((topic) => (
              <li key={topic.id} className={styles.tag}>
                {topic.name}
                {topic.lastReviewedAt && (
                  <span className={styles.tagDays}>{daysSince(topic.lastReviewedAt)} ימים</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function TopicConfidence({ topics }) {
  if (!topics) return <p className={styles.muted}>טוען...</p>
  if (topics.length === 0) {
    return <p className={styles.muted}>עוד אין סימונים. אחרי שתסמני כמה נושאים, הם יופיעו כאן.</p>
  }

  return (
    <>
      <ul className={styles.confidenceList}>
        {topics.map((topic) => (
          <li key={topic.id} className={styles.confidenceRow}>
            <span className={styles.topicName}>{topic.name}</span>
            <div className={styles.bar} aria-hidden="true">
              <div
                className={topic.avgConfidence < 3 ? styles.weakFill : styles.fill}
                style={{ width: `${(topic.avgConfidence / 5) * 100}%` }}
              />
            </div>
            <span className={styles.score}>
              {topic.avgConfidence}
              <span className={styles.muted}> ({topic.reviewCount})</span>
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.legend}>ממוצע מתוך 5. בסוגריים: מספר הסימונים. החלשים למעלה.</p>
    </>
  )
}
