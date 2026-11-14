import { useReducer, type Dispatch, type FormEvent } from 'react'
import { taskReducer, initialState, type Task, type Action } from './taskReducer'
import { countByFilter, filterTasks, FILTERS, type Filter } from './filter'
import TaskRow from './TaskRow'
import './style.css'

const LABELS: Record<Filter, string> = {
  all: 'All', todo: 'To do', 'in-progress': 'In progress', done: 'Done',
}

function AddForm({ dispatch }: { dispatch: Dispatch<Action> }) {
  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const title = String(new FormData(form).get('title') ?? '').trim()
    if (title) {
      dispatch({ type: 'add', id: crypto.randomUUID(), title })
      form.reset()
    }
  }
  return (
    <form onSubmit={addTask} className="add-form">
      <input name="title" aria-label="New task" placeholder="New task" maxLength={120} required />
      <button type="submit">Add</button>
    </form>
  )
}

function FilterBar({ filter, counts, dispatch }: {
  filter: Filter; counts: Record<Filter, number>; dispatch: Dispatch<Action>
}) {
  return (
    <div className="filters" role="group" aria-label="Filter by status">
      {FILTERS.map((item) => (
        <button key={item} type="button" aria-pressed={filter === item}
          className={`filter-button ${filter === item ? 'selected' : ''}`}
          onClick={() => dispatch({ type: 'setFilter', filter: item })}>
          {LABELS[item]} <span className="count">{counts[item]}</span>
        </button>
      ))}
    </div>
  )
}

function TaskList({ tasks, dispatch }: { tasks: Task[]; dispatch: Dispatch<Action> }) {
  if (tasks.length === 0) return <p className="empty">No tasks here. Try another filter or add a task.</p>
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task}
          onNext={() => dispatch({ type: 'advance', id: task.id })}
          onDelete={() => dispatch({ type: 'remove', id: task.id })} />
      ))}
    </ul>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  const counts = countByFilter(state.tasks)
  const visible = filterTasks(state.tasks, state.filter)
  return (
    <>
      <main>
        <h1>Task Manager</h1>
        <AddForm dispatch={dispatch} />
        <p>Total tasks: {counts.all} | Completed: {counts.done}</p>
        <FilterBar filter={state.filter} counts={counts} dispatch={dispatch} />
        <TaskList tasks={visible} dispatch={dispatch} />
        <div className="actions">
          <button type="button" onClick={() => dispatch({ type: 'clearDone' })} disabled={counts.done === 0}>Clear done</button>
          <button type="button" onClick={() => dispatch({ type: 'undo' })} disabled={state.past.length === 0}>Undo</button>
        </div>
      </main>
      <footer>Huriye Kayadelen</footer>
    </>
  )
}
