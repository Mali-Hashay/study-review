import { useEffect, useState } from 'react'
import { api } from '../../api/api.js'
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx'
import forms from '../../components/forms.module.css'
import { DAY_NAMES } from '../../utils/days.js'
import { ArchiveSection } from './ArchiveSection.jsx'
import { CategoryFormDialog } from './CategoryFormDialog.jsx'
import styles from './ManagementPage.module.css'
import { TopicsPanel } from './TopicsPanel.jsx'

const STUDY_DAYS = [1, 2, 3, 4, 5]

function describeTopicCount(count) {
  if (count === 0) return 'אין נושאים'
  if (count === 1) return 'נושא אחד'
  return `${count} נושאים`
}

export function ManagementPage() {
  const [categories, setCategories] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [notice, setNotice] = useState(null)

  // { category: null | category, defaults: { dayOfWeek, orderIndex } } while the form is open
  const [form, setForm] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [openCategoryId, setOpenCategoryId] = useState(null)

  function toggleTopics(categoryId) {
    setOpenCategoryId((current) => (current === categoryId ? null : categoryId))
  }

  function loadCategories() {
    return api('/categories')
      .then((data) => setCategories(data.categories))
      .catch((err) => setLoadError(err.message))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // Changing the key makes ArchiveSection reload (something may have moved in or out of the archive)
  const [archiveKey, setArchiveKey] = useState(0)

  function refreshAll() {
    setArchiveKey((key) => key + 1)
    return loadCategories()
  }

  function openNew(day, dayCategories) {
    setForm({ category: null, defaults: { dayOfWeek: day, orderIndex: dayCategories.length + 1 } })
  }

  async function handleSaved() {
    setForm(null)
    setNotice(null)
    await loadCategories()
  }

  async function handleDelete() {
    const data = await api(`/categories/${deleting.id}`, { method: 'DELETE' })
    setNotice(
      data.archived
        ? `לקטגוריה "${deleting.name}" יש היסטוריה של סימונים, ולכן היא הועברה לארכיון ולא נמחקה.`
        : `הקטגוריה "${deleting.name}" נמחקה.`,
    )
    setDeleting(null)
    await refreshAll()
  }

  return (
    <div className={styles.page}>
      <h1>ניהול התוכן</h1>

      {notice && (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      )}
      {loadError && <p className={forms.error}>{loadError}</p>}
      {!categories && !loadError && <p>טוען...</p>}

      {categories && (
        <div className={styles.days}>
          {STUDY_DAYS.map((day) => {
            const dayCategories = categories.filter((category) => category.day_of_week === day)
            return (
              <section key={day} className={`${styles.day} lift`}>
                <header className={styles.dayHeader}>
                  <h2>יום {DAY_NAMES[day]}</h2>
                  <button type="button" className={styles.addButton} onClick={() => openNew(day, dayCategories)}>
                    + קטגוריה
                  </button>
                </header>

                {dayCategories.length === 0 && <p className={styles.empty}>אין קטגוריות ביום זה</p>}

                <ul className={styles.list}>
                  {dayCategories.map((category) => (
                    <li key={category.id} className={styles.row}>
                      <div className={styles.rowMain}>
                        <div>
                          <strong>{category.name}</strong>
                          {category.description && <p className={styles.description}>{category.description}</p>}
                          <button
                            type="button"
                            className={styles.topicsToggle}
                            onClick={() => toggleTopics(category.id)}
                            aria-expanded={openCategoryId === category.id}
                          >
                            {describeTopicCount(category.topic_count)}{' '}
                            {openCategoryId === category.id ? '▴' : '▾'}
                          </button>
                        </div>
                        <div className={styles.actions}>
                          <button type="button" onClick={() => setForm({ category, defaults: null })}>
                            עריכה
                          </button>
                          <button type="button" className={styles.deleteButton} onClick={() => setDeleting(category)}>
                            מחיקה
                          </button>
                        </div>
                      </div>
                      {openCategoryId === category.id && (
                        <TopicsPanel category={category} onChange={refreshAll} />
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}

      {categories && <ArchiveSection refreshKey={archiveKey} onRestored={refreshAll} />}

      <CategoryFormDialog
        open={Boolean(form)}
        category={form?.category}
        defaults={form?.defaults}
        onClose={() => setForm(null)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="מחיקת קטגוריה"
        message={`למחוק את "${deleting?.name}"? אם יש לה היסטוריה של סימונים, היא תעבור לארכיון ולא תימחק.`}
        confirmLabel="מחיקה"
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
