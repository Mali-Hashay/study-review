import { describeLastReviewed } from '../utils/lastReviewed.js'
import styles from './CategoryCard.module.css'

function describeTaskCount(count) {
  return count === 1 ? 'משימה אחת' : `${count} משימות`
}

export function CategoryCard({ category, onToggle }) {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>{category.name}</h3>

      {category.topics.length === 0 ? (
        <p className={styles.empty}>אין עדיין נושאים בקטגוריה הזו</p>
      ) : (
        <ul className={styles.topics}>
          {category.topics.map((topic) => (
            <li key={topic.id} className={styles.topic}>
              <button
                type="button"
                className={topic.reviewedThisWeek ? styles.checked : styles.check}
                onClick={() => onToggle(topic)}
                aria-pressed={topic.reviewedThisWeek}
                aria-label={
                  topic.reviewedThisWeek ? `ביטול הסימון של ${topic.name}` : `סימון ${topic.name}`
                }
              >
                {topic.reviewedThisWeek ? '✓' : ''}
              </button>
              <div className={styles.text}>
                <span className={topic.reviewedThisWeek ? styles.doneName : undefined}>
                  {topic.name}
                </span>
                {(!topic.reviewedThisWeek || topic.taskCount > 0) && (
                  <span className={styles.lastReviewed}>
                    {[
                      !topic.reviewedThisWeek && describeLastReviewed(topic.lastReviewedAt),
                      topic.taskCount > 0 && describeTaskCount(topic.taskCount),
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
