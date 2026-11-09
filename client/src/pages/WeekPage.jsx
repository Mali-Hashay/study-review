import { useEffect, useState } from 'react'
import { api } from '../api/api.js'
import { CategoryCard } from '../components/CategoryCard.jsx'
import { Modal } from '../components/Modal.jsx'
import { QuoteCards } from '../components/QuoteCards.jsx'
import { ReviewDialog } from '../components/ReviewDialog.jsx'
import forms from '../components/forms.module.css'
import { DAY_NAMES, getTodayDayOfWeek } from '../utils/days.js'
import styles from './WeekPage.module.css'

const STUDY_DAYS = [1, 2, 3, 4, 5]

export function WeekPage() {
  const [categories, setCategories] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [reviewTopic, setReviewTopic] = useState(null)
  const [unreviewTopic, setUnreviewTopic] = useState(null)

  const today = getTodayDayOfWeek()
  const isWeekend = today > 5

  function loadWeek() {
    return api('/week')
      .then((data) => setCategories(data.categories))
      .catch((err) => setLoadError(err.message))
  }

  useEffect(() => {
    loadWeek()
  }, [])

  function markReviewed(topicId) {
    setCategories((current) =>
      current.map((category) => ({
        ...category,
        topics: category.topics.map((topic) =>
          topic.id === topicId
            ? { ...topic, reviewedThisWeek: true, lastReviewedAt: new Date().toISOString() }
            : topic,
        ),
      })),
    )
  }

  function handleToggle(topic) {
    if (topic.reviewedThisWeek) setUnreviewTopic(topic)
    else setReviewTopic(topic)
  }

  const allTopics = categories?.flatMap((category) => category.topics) ?? []
  const doneCount = allTopics.filter((topic) => topic.reviewedThisWeek).length

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>הדרך שלנו לעבודת החלומות</h1>
        <QuoteCards />
      </section>

      <div className={styles.summary}>
        {isWeekend && <strong>אין תוכנית היום. סוף שבוע נעים! </strong>}
        {categories && (
          <span>
            {doneCount === 0
              ? 'השבוע עוד לא תרגלת נושאים'
              : `השבוע תרגלת ${doneCount} ${doneCount === 1 ? 'נושא' : 'נושאים'}`}
          </span>
        )}
      </div>

      {loadError && (
        <p className={forms.error} role="alert">
          {loadError}
        </p>
      )}
      {!categories && !loadError && <p>טוען...</p>}

      {categories && (
        <div className={styles.road}>
          <div className={styles.week}>
            {STUDY_DAYS.map((day) => {
              const isToday = day === today
              const dayCategories = categories.filter((category) => category.dayOfWeek === day)

              return (
                <section key={day} className={isToday ? styles.today : styles.day}>
                  <h2 className={styles.dayHeader}>
                    {DAY_NAMES[day]}
                    {isToday && <span className={styles.todayBadge}>היום</span>}
                  </h2>
                  <div className={styles.dayBody}>
                    {dayCategories.length === 0 ? (
                      <p className={styles.empty}>אין קטגוריות</p>
                    ) : (
                      dayCategories.map((category) => (
                        <CategoryCard key={category.id} category={category} onToggle={handleToggle} />
                      ))
                    )}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      )}

      <ReviewDialog
        topic={reviewTopic}
        onClose={() => setReviewTopic(null)}
        onSaved={(topic) => {
          markReviewed(topic.id)
          setReviewTopic(null)
        }}
      />

      {/* After un-marking, the "last reviewed" date goes back to an older review that only
          the server knows, so we reload the week instead of updating locally */}
      <UnreviewDialog
        topic={unreviewTopic}
        onClose={() => setUnreviewTopic(null)}
        onDone={() => {
          setUnreviewTopic(null)
          loadWeek()
        }}
      />
    </div>
  )
}

function UnreviewDialog({ topic, onClose, onDone }) {
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function handleConfirm() {
    setError(null)
    setDeleting(true)
    try {
      await api(`/topics/${topic.id}/reviews/this-week`, { method: 'DELETE' })
      onDone(topic)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal open={Boolean(topic)} title="ביטול סימון" onClose={onClose}>
      <div className={forms.body}>
        <p>
          לבטל את הסימון של <strong>{topic?.name}</strong>? הסימונים שלך לנושא הזה מהשבוע יימחקו.
        </p>
        {error && (
          <p className={forms.error} role="alert">
            {error}
          </p>
        )}
        <div className={forms.actions}>
          <button type="button" className={forms.secondary} onClick={onClose}>
            השארת הסימון
          </button>
          <button type="button" className={forms.danger} onClick={handleConfirm} disabled={deleting}>
            כן, לבטל
          </button>
        </div>
      </div>
    </Modal>
  )
}
