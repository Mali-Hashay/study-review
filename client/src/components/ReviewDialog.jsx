import { useEffect, useState } from 'react'
import { api } from '../api/api.js'
import { Modal } from './Modal.jsx'
import forms from './forms.module.css'
import styles from './ReviewDialog.module.css'

const CONFIDENCE_LEVELS = [1, 2, 3, 4, 5]

// Opens when `topic` is set; calls onSaved(topic) after a successful save
export function ReviewDialog({ topic, onClose, onSaved }) {
  return (
    <Modal open={Boolean(topic)} title={topic ? `סימון: ${topic.name}` : ''} onClose={onClose}>
      {topic && <ReviewForm topic={topic} onClose={onClose} onSaved={onSaved} />}
    </Modal>
  )
}

function ReviewForm({ topic, onClose, onSaved }) {
  const [tasks, setTasks] = useState([])
  const [confidence, setConfidence] = useState(null)
  const [taskId, setTaskId] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api(`/topics/${topic.id}/tasks`)
      .then((data) => setTasks(data.tasks))
      .catch(() => setTasks([]))
  }, [topic.id])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!confidence) {
      setError('חובה לבחור רמת ביטחון')
      return
    }
    setError(null)
    setSaving(true)
    try {
      await api(`/topics/${topic.id}/reviews`, {
        method: 'POST',
        body: {
          confidence,
          taskId: taskId ? Number(taskId) : undefined,
          notes: notes.trim() || undefined,
        },
      })
      onSaved(topic)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form className={forms.body} onSubmit={handleSubmit}>
      <fieldset className={styles.confidence}>
        <legend>כמה את בטוחה בחומר?</legend>
        <div className={styles.levels}>
          {CONFIDENCE_LEVELS.map((level) => (
            <label key={level} className={styles.level}>
              <input
                type="radio"
                name="confidence"
                value={level}
                checked={confidence === level}
                onChange={() => setConfidence(level)}
              />
              <span>{level}</span>
            </label>
          ))}
        </div>
        <div className={styles.scale}>
          <span>בכלל לא</span>
          <span>שולטת</span>
        </div>
      </fieldset>

      {tasks.length > 0 && (
        <label className={forms.field}>
          משימה <span className={forms.hint}>(לא חובה)</span>
          <select value={taskId} onChange={(event) => setTaskId(event.target.value)}>
            <option value="">בלי משימה מסוימת</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className={forms.field}>
        הערות <span className={forms.hint}>(לא חובה)</span>
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={1000} />
      </label>

      {error && (
        <p className={forms.error} role="alert">
          {error}
        </p>
      )}

      <div className={forms.actions}>
        <button type="button" className={forms.secondary} onClick={onClose}>
          ביטול
        </button>
        <button type="submit" className={forms.primary} disabled={saving}>
          {saving ? 'שומר...' : 'שמירה'}
        </button>
      </div>
    </form>
  )
}
