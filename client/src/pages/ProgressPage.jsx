import { useEffect, useState } from 'react'
import { api } from '../api/api.js'
import forms from '../components/forms.module.css'
import { DAY_NAMES } from '../utils/days.js'
import { describeLastReviewed } from '../utils/lastReviewed.js'
import styles from './ProgressPage.module.css'

export function ProgressPage() {
  return (
    <div className={styles.page}>
      <h1>ההתקדמות שלי</h1>
      <div className={styles.sections}>
        <StaleTopics />
        <TopicConfidence />
      </div>
    </div>
  )
}

const DAY_OPTIONS = [7, 14, 30, 60]

function StaleTopics() {
  const [days, setDays] = useState(14)
  const [topics, setTopics] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api(`/stale-topics?days=${days}`)
      .then((data) => {
        setTopics(data.topics)
        setError(null)
      })
      .catch((err) => setError(err.message))
  }, [days])

  return (
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

      {error && <p className={forms.error}>{error}</p>}
      {!topics && !error && <p className={styles.muted}>טוען...</p>}
      {topics?.length === 0 && <p className={styles.muted}>כל הכבוד! אין נושאים שהוזנחו </p>}

      {topics?.length > 0 && (
        <ul className={styles.list}>
          {topics.map((topic) => (
            <li key={topic.id} className={styles.row}>
              <div>
                <strong>{topic.name}</strong>
                <span className={styles.muted}>
                  {' '}
                  · {topic.categoryName} (יום {DAY_NAMES[topic.dayOfWeek]})
                </span>
              </div>
              <span className={topic.lastReviewedAt ? styles.muted : styles.never}>
                {describeLastReviewed(topic.lastReviewedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function TopicConfidence() {
  const [topics, setTopics] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api('/stats/topic-confidence')
      .then((data) => setTopics(data.topics))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <section className={styles.section}>
      <header className={styles.sectionHeader}>
        <h2>רמת ביטחון לפי נושא</h2>
      </header>

      {error && <p className={forms.error}>{error}</p>}
      {!topics && !error && <p className={styles.muted}>טוען...</p>}
      {topics?.length === 0 && (
        <p className={styles.muted}>עוד אין סימונים. אחרי שתסמני כמה נושאים, הם יופיעו כאן.</p>
      )}

      {topics?.length > 0 && (
        <ul className={styles.list}>
          {topics.map((topic) => (
            <li key={topic.id} className={styles.confidenceRow}>
              <span className={styles.topicName}>{topic.name}</span>
              <div className={styles.bar} aria-hidden="true">
                {/* Width = average out of 5 */}
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
      )}
      {topics?.length > 0 && (
        <p className={styles.legend}>ממוצע מתוך 5. בסוגריים: מספר הסימונים. החלשים למעלה.</p>
      )}
    </section>
  )
}
