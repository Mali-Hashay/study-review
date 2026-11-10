import { useCallback, useEffect, useState } from 'react'
import { api } from '../../api/api.js'
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx'
import forms from '../../components/forms.module.css'
import { PencilIcon, TrashIcon } from '../../components/icons.jsx'
import { TASK_DIFFICULTIES, TASK_TYPES } from '../../utils/taskLabels.js'
import { TaskFormDialog } from './TaskFormDialog.jsx'
import styles from './TopicsPanel.module.css'

// The tasks of one topic. Same structure as TopicsPanel, one level deeper.
export function TasksPanel({ topic, onChange }) {
  const [tasks, setTasks] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [form, setForm] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const loadTasks = useCallback(() => {
    return api(`/topics/${topic.id}/tasks`)
      .then((data) => setTasks(data.tasks))
      .catch((err) => setLoadError(err.message))
  }, [topic.id])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  async function handleSaved() {
    setForm(null)
    setNotice(null)
    await loadTasks()
    onChange()
  }

  // Tasks are always really deleted: review_logs.task_id is ON DELETE SET NULL, so history stays
  async function handleDelete() {
    await api(`/tasks/${deleting.id}`, { method: 'DELETE' })
    setNotice(`המשימה "${deleting.title}" נמחקה.`)
    setDeleting(null)
    await loadTasks()
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
      {!tasks && !loadError && <p className={styles.muted}>טוען...</p>}
      {tasks?.length === 0 && <p className={styles.muted}>אין עדיין משימות לנושא זה</p>}

      {tasks?.length > 0 && (
        <ul className={styles.list}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.row}>
              <div>
                {task.link ? (
                  <a href={task.link} target="_blank" rel="noreferrer">
                    {task.title}
                  </a>
                ) : (
                  <span>{task.title}</span>
                )}
                <span className={styles.muted}>
                  {' '}
                  · {TASK_TYPES[task.type]} · {TASK_DIFFICULTIES[task.difficulty]}
                </span>
              </div>
              <div className={styles.actions}>
                {/* Icon-only buttons: aria-label is what screen readers say, title is the hover tooltip */}
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setForm({ task })}
                  aria-label={`עריכת ${task.title}`}
                  title="עריכה"
                >
                  <PencilIcon />
                </button>
                <button
                  type="button"
                  className={`${styles.iconButton} ${styles.deleteButton}`}
                  onClick={() => setDeleting(task)}
                  aria-label={`מחיקת ${task.title}`}
                  title="מחיקה"
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className={styles.addButton} onClick={() => setForm({ task: null })}>
        + משימה
      </button>

      <TaskFormDialog
        open={Boolean(form)}
        task={form?.task}
        topicId={topic.id}
        onClose={() => setForm(null)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="מחיקת משימה"
        message={`למחוק את "${deleting?.title}"? סימונים שנעשו עם המשימה הזו יישמרו, רק בלי הקישור אליה.`}
        confirmLabel="מחיקה"
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
