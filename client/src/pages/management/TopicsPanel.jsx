import { useCallback, useEffect, useState } from 'react'
import { api } from '../../api/api.js'
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx'
import forms from '../../components/forms.module.css'
import { TasksPanel } from './TasksPanel.jsx'
import { TopicFormDialog } from './TopicFormDialog.jsx'
import styles from './TopicsPanel.module.css'

function describeTaskCount(count) {
  if (count === 0) return 'אין משימות'
  if (count === 1) return 'משימה אחת'
  return `${count} משימות`
}

// The topics of one category, shown when the category is opened.
// `onChange` lets the parent refresh the topic count after an add or delete.
export function TopicsPanel({ category, onChange }) {
  const [topics, setTopics] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [notice, setNotice] = useState(null)

  // { topic: null | topic } while the form is open
  const [form, setForm] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [openTopicId, setOpenTopicId] = useState(null)

  const loadTopics = useCallback(() => {
    return api(`/categories/${category.id}/topics`)
      .then((data) => setTopics(data.topics))
      .catch((err) => setLoadError(err.message))
  }, [category.id])

  useEffect(() => {
    loadTopics()
  }, [loadTopics])

  async function handleSaved() {
    setForm(null)
    setNotice(null)
    await loadTopics()
    onChange()
  }

  async function handleDelete() {
    const data = await api(`/topics/${deleting.id}`, { method: 'DELETE' })
    setNotice(
      data.archived
        ? `לנושא "${deleting.name}" יש היסטוריה של סימונים, ולכן הוא הועבר לארכיון ולא נמחק.`
        : `הנושא "${deleting.name}" נמחק.`,
    )
    setDeleting(null)
    await loadTopics()
    onChange()
  }

  return (
    <div className={styles.panel}>
      {notice && (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      )}
      {loadError && <p className={forms.error}>{loadError}</p>}
      {!topics && !loadError && <p className={styles.muted}>טוען...</p>}
      {topics?.length === 0 && <p className={styles.muted}>אין עדיין נושאים בקטגוריה זו</p>}

      {topics?.length > 0 && (
        <ul className={styles.list}>
          {topics.map((topic) => (
            <li key={topic.id} className={styles.item}>
              <div className={styles.row}>
                <div className={styles.name}>
                  <span>{topic.name}</span>
                  <button
                    type="button"
                    className={styles.tasksToggle}
                    onClick={() => setOpenTopicId((current) => (current === topic.id ? null : topic.id))}
                    aria-expanded={openTopicId === topic.id}
                  >
                    {describeTaskCount(topic.task_count)} {openTopicId === topic.id ? '▴' : '▾'}
                  </button>
                </div>
                <div className={styles.actions}>
                  <button type="button" onClick={() => setForm({ topic })}>
                    עריכה
                  </button>
                  <button type="button" className={styles.deleteButton} onClick={() => setDeleting(topic)}>
                    מחיקה
                  </button>
                </div>
              </div>
              {openTopicId === topic.id && <TasksPanel topic={topic} onChange={loadTopics} />}
            </li>
          ))}
        </ul>
      )}

      <button type="button" className={styles.addButton} onClick={() => setForm({ topic: null })}>
        + נושא
      </button>

      <TopicFormDialog
        open={Boolean(form)}
        topic={form?.topic}
        categoryId={category.id}
        defaultOrder={(topics?.length ?? 0) + 1}
        onClose={() => setForm(null)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="מחיקת נושא"
        message={`למחוק את "${deleting?.name}"? אם יש לו היסטוריה של סימונים, הוא יעבור לארכיון ולא יימחק.`}
        confirmLabel="מחיקה"
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
