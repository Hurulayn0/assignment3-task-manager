// Full name: Huriye Kayadelen | Student number: 2200005795
// Assignment 3 - Reducer-based Task Manager
import type { Filter } from './filter'

export type Status = 'todo' | 'in-progress' | 'done'
export type Task = { id: string; title: string; status: Status }
export type State = { tasks: Task[]; filter: Filter; past: Task[][] }

export type Action =
  | { type: 'add'; id: string; title: string }
  | { type: 'advance'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'setFilter'; filter: Filter }
  | { type: 'clearDone' }
  | { type: 'undo' }

export const initialState: State = { tasks: [], filter: 'all', past: [] }

const NEXT: Record<Status, Status> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
}

function withHistory(state: State, tasks: Task[]): State {
  if (tasks === state.tasks) return state
  return { ...state, tasks, past: [...state.past, state.tasks] }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(value)}`)
}

export function taskReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      if (!action.title.trim() || state.tasks.some(task => task.id === action.id)) return state
      return withHistory(state, [...state.tasks, {
        id: action.id, title: action.title.trim(), status: 'todo',
      }])
    case 'advance':
      if (!state.tasks.some((task) => task.id === action.id)) return state
      return withHistory(state, state.tasks.map((task) =>
        task.id === action.id ? { ...task, status: NEXT[task.status] } : task,
      ))
    case 'remove':
      if (!state.tasks.some((task) => task.id === action.id)) return state
      return withHistory(state, state.tasks.filter((task) => task.id !== action.id))
    case 'setFilter':
      return action.filter === state.filter ? state : { ...state, filter: action.filter }
    case 'clearDone':
      if (!state.tasks.some((task) => task.status === 'done')) return state
      return withHistory(state, state.tasks.filter((task) => task.status !== 'done'))
    case 'undo': {
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return { ...state, tasks: previous, past: state.past.slice(0, -1) }
    }
    default:
      return assertNever(action)
  }
}
