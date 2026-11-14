import type { Task, Status } from './taskReducer'

type TaskRowProps = { task: Task; onNext: () => void; onDelete: () => void }
const STATUS_LABELS: Record<Status, string> = {
  todo: 'To do', 'in-progress': 'In progress', done: 'Done',
}
export default function TaskRow({ task, onNext, onDelete }: TaskRowProps) {
  return (
    <li className="task-row">
      <span className={`status-dot ${task.status}`} aria-hidden="true" />
      <span className="task-title">{task.title}</span>
      <span className={`status-pill ${task.status}`}>{STATUS_LABELS[task.status]}</span>
      <button type="button" onClick={onNext} aria-label={`Next status for ${task.title}`}>Next</button>
      <button type="button" className="delete" onClick={onDelete} aria-label={`Delete ${task.title}`}>Delete</button>
    </li>
  )
}
