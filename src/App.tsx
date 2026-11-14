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
      <input name="title" aria-label="New task" placeholder="What needs to be done?" maxLength={120} required />
      <button type="submit" className="primary">+ Add task</button>
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
  if (tasks.length === 0) return <div className="empty">No tasks here.<span>Try another filter or add a task.</span></div>
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
    <main className="app-shell">
      <div className="eyebrow">ADVANCED WEB PROGRAMMING · ASSIGNMENT 3</div>
      <header>
        <div><h1>Task Manager</h1><p>Organize your day, one task at a time.</p></div>
        <div className="total"><strong>{counts.all}</strong><span>Total tasks</span></div>
      </header>
      <section className="panel" aria-label="Task manager">
        <h2>Add a new task</h2>
        <AddForm dispatch={dispatch} />
        <div className="section-header"><h2>Your tasks</h2><span>{counts.done} completed</span></div>
        <FilterBar filter={state.filter} counts={counts} dispatch={dispatch} />
        <TaskList tasks={visible} dispatch={dispatch} />
        <div className="actions">
          <button type="button" onClick={() => dispatch({ type: 'undo' })} disabled={state.past.length === 0}>↶ Undo</button>
          <button type="button" onClick={() => dispatch({ type: 'clearDone' })} disabled={counts.done === 0}>Clear done</button>
        </div>
      </section>
      <footer>Built with React + TypeScript · State managed with useReducer</footer>
    </main>
  )
}
