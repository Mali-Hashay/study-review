import { useEffect, useState } from 'react'
import { api } from '../../api/api.js'
import forms from '../../components/forms.module.css'
import { DAY_NAMES } from '../../utils/days.js'
import styles from './ArchiveSection.module.css'

// `refreshKey` changes whenever something may have been archived, so the list reloads.
// `onRestored` lets the page reload the active categories after a restore.
export function ArchiveSection({ refreshKey, onRestored }) {
  const [archive, setArchive] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api('/archive')
      .then((data) => setArchive(data))
      .catch((err) => setError(err.message))
  }, [refreshKey])

  async function restore(path) {
    setError(null)
    try {
      await api(path, { method: 'POST' })
      onRestored()
    } catch (err) {
      setError(err.message)
    }
  }

  const isEmpty = archive && archive.categories.length === 0 && archive.topics.length === 0

  return (
    <section className={styles.archive}>
      <h2>ארכיון</h2>
      <p className={styles.hint}>
        קטגוריות ונושאים שנמחקו אבל יש להם היסטוריה של סימונים. ניתן להחזיר אותם.
      </p>

      {error && <p className={forms.error}>{error}</p>}
      {isEmpty && <p className={styles.hint}>הארכיון ריק.</p>}

      {archive?.categories.length > 0 && (
        <>
          <h3>קטגוריות</h3>
          <ul className={styles.list}>
            {archive.categories.map((category) => (
              <li key={category.id} className={styles.row}>
                <span>
                  {category.name} <span className={styles.hint}>(יום {DAY_NAMES[category.dayOfWeek]})</span>
                </span>
                <button type="button" onClick={() => restore(`/archive/categories/${category.id}/restore`)}>
                  שחזור
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {archive?.topics.length > 0 && (
        <>
          <h3>נושאים</h3>
          <ul className={styles.list}>
            {archive.topics.map((topic) => (
              <li key={topic.id} className={styles.row}>
                <span>
                  {topic.name} <span className={styles.hint}>· {topic.categoryName}</span>
                </span>
                {topic.categoryArchived ? (
                  <span className={styles.hint}>יש לשחזר קודם את הקטגוריה</span>
                ) : (
                  <button type="button" onClick={() => restore(`/archive/topics/${topic.id}/restore`)}>
                    שחזור
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
