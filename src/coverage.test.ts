import { describe, expect, it } from 'vitest'
import { taskReducer, type State, type Action } from './taskReducer'
import { FILTERS, countByFilter, filterTasks } from './filter'

const fixture = (): State => ({ tasks: [
  { id: 'a', title: 'Read', status: 'todo' },
  { id: 'b', title: 'Build', status: 'in-progress' },
  { id: 'c', title: 'Review', status: 'done' },
  { id: 'd', title: 'Submit', status: 'done' },
], filter: 'all', past: [] })

function freeze(state: State): State {
  for (const tasks of [...state.past, state.tasks]) {
    tasks.forEach(Object.freeze)
    Object.freeze(tasks)
  }
  Object.freeze(state.past)
  return Object.freeze(state)
}

describe('additional reducer and history coverage', () => {
  it('appends a trimmed todo task while preserving existing order and references', () => {
    const state = fixture()
    const next = taskReducer(state, { type: 'add', id: 'e', title: '  Ship  ' })
    expect(next.tasks).toEqual([...state.tasks, { id: 'e', title: 'Ship', status: 'todo' }])
    state.tasks.forEach((task, index) => expect(next.tasks[index]).toBe(task))
    expect(next.past).toEqual([state.tasks])
  })
  it.each(FILTERS)('sets %s without changing tasks or existing history', filter => {
    const state = taskReducer(fixture(), { type: 'remove', id: 'a' })
    const next = taskReducer(state, { type: 'setFilter', filter })
    expect(next.filter).toBe(filter)
    expect(next.tasks).toBe(state.tasks)
    expect(next.past).toBe(state.past)
    if (filter === state.filter) expect(next).toBe(state)
  })
  it('clearDone on an empty list with existing history does not create an undo step', () => {
    const state: State = { tasks: [], filter: 'done', past: [fixture().tasks] }
    expect(taskReducer(state, { type: 'clearDone' })).toBe(state)
  })
  it('clearDone removes all tasks when all are completed and Undo restores exact order', () => {
    const state: State = { ...fixture(), tasks: fixture().tasks.slice(2), filter: 'done' }
    const next = taskReducer(state, { type: 'clearDone' })
    expect(next.tasks).toEqual([])
    expect(next.past).toEqual([state.tasks])
    expect(taskReducer(next, { type: 'undo' }).tasks).toBe(state.tasks)
  })
  it('Undo with no history preserves a nonempty state and selected filter', () => {
    const state: State = { ...fixture(), filter: 'todo' }
    expect(taskReducer(state, { type: 'undo' })).toBe(state)
  })
  it('successive Undo reverses add, advance, remove and clearDone one step at a time', () => {
    const start = fixture()
    const actions: Action[] = [
      { type: 'add', id: 'e', title: 'Ship' }, { type: 'advance', id: 'a' },
      { type: 'remove', id: 'b' }, { type: 'clearDone' },
    ]
    const states = [start]
    for (const action of actions) states.push(taskReducer(states[states.length - 1], action))
    let state = taskReducer(states[4], { type: 'setFilter', filter: 'done' })
    for (let index = 3; index >= 0; index--) {
      state = taskReducer(state, { type: 'undo' })
      expect(state.tasks).toBe(states[index].tasks)
      expect(state.past).toHaveLength(index)
      expect(state.filter).toBe('done')
    }
    expect(taskReducer(state, { type: 'undo' })).toBe(state)
  })
  it('filter changes between edits are skipped by Undo', () => {
    const start = fixture()
    let state = taskReducer(start, { type: 'advance', id: 'a' })
    state = taskReducer(state, { type: 'setFilter', filter: 'todo' })
    state = taskReducer(state, { type: 'setFilter', filter: 'done' })
    expect(state.past).toHaveLength(1)
    state = taskReducer(state, { type: 'undo' })
    expect(state.tasks).toBe(start.tasks)
    expect(state.filter).toBe('done')
    expect(state.past).toEqual([])
  })
  it('a new edit after Undo retains only the remaining history', () => {
    const start = fixture()
    const advanced = taskReducer(start, { type: 'advance', id: 'a' })
    const removed = taskReducer(advanced, { type: 'remove', id: 'b' })
    const undone = taskReducer(removed, { type: 'undo' })
    const edited = taskReducer(undone, { type: 'add', id: 'e', title: 'New branch' })
    expect(edited.past).toEqual([start.tasks, advanced.tasks])
    expect(taskReducer(edited, { type: 'undo' }).tasks).toBe(advanced.tasks)
    expect(removed.tasks.map(task => task.id)).toEqual(['a', 'c', 'd'])
  })
  it.each<Action>([
    { type: 'add', id: 'e', title: 'Ship' }, { type: 'advance', id: 'a' },
    { type: 'remove', id: 'b' }, { type: 'clearDone' }, { type: 'undo' },
  ])('does not mutate frozen state, objects or history for $type', action => {
    const state = freeze(taskReducer(taskReducer(fixture(), { type: 'advance', id: 'd' }), { type: 'add', id: 'z', title: 'Earlier edit' }))
    const before = structuredClone(state)
    const next = taskReducer(state, action)
    expect(state).toEqual(before)
    expect(next).not.toBe(state)
    expect(next.past).not.toBe(state.past)
    expect(next.past[0]).toBe(state.past[0])
    if (action.type !== 'undo') expect(next.past.at(-1)).toBe(state.tasks)
  })
  it('missing IDs do not consume existing history', () => {
    const state = taskReducer(fixture(), { type: 'remove', id: 'b' })
    for (const type of ['advance', 'remove'] as const) {
      expect(taskReducer(state, { type, id: 'missing' })).toBe(state)
    }
    expect(taskReducer(state, { type: 'undo' }).tasks).toHaveLength(4)
  })
  it('updates derived lists and counts for mutations under the done filter', () => {
    let state: State = { ...fixture(), filter: 'done' }
    state = taskReducer(state, { type: 'add', id: 'e', title: 'Hidden todo' })
    expect(filterTasks(state.tasks, state.filter).map(task => task.id)).toEqual(['c', 'd'])
    expect(countByFilter(state.tasks)).toEqual({ all: 5, todo: 2, 'in-progress': 1, done: 2 })
    state = taskReducer(state, { type: 'advance', id: 'b' })
    expect(filterTasks(state.tasks, state.filter).map(task => task.id)).toEqual(['b', 'c', 'd'])
    state = taskReducer(state, { type: 'remove', id: 'c' })
    expect(countByFilter(state.tasks)).toEqual({ all: 4, todo: 2, 'in-progress': 0, done: 2 })
    state = taskReducer(state, { type: 'clearDone' })
    expect(filterTasks(state.tasks, state.filter)).toEqual([])
    expect(countByFilter(state.tasks)).toEqual({ all: 2, todo: 2, 'in-progress': 0, done: 0 })
    expect(state.filter).toBe('done')
  })
})

describe('derived state edge cases', () => {
  it('returns empty results for every filter without mutating a frozen empty array', () => {
    const tasks = fixture().tasks.slice(0, 0)
    Object.freeze(tasks)
    for (const filter of FILTERS) expect(filterTasks(tasks, filter)).toEqual([])
  })
  it('preserves order, objects and frozen input when filtering and counting repeatedly', () => {
    const state = freeze(fixture())
    for (let index = 0; index < 2; index++) {
      expect(filterTasks(state.tasks, 'done')).toEqual(state.tasks.slice(2))
      expect(filterTasks(state.tasks, 'done')[0]).toBe(state.tasks[2])
      expect(countByFilter(state.tasks)).toEqual({ all: 4, todo: 1, 'in-progress': 1, done: 2 })
    }
  })
  it('recounts each status transition including done back to todo', () => {
    let state: State = { tasks: [fixture().tasks[0]], filter: 'all', past: [] }
    for (const counts of [
      { all: 1, todo: 0, 'in-progress': 1, done: 0 },
      { all: 1, todo: 0, 'in-progress': 0, done: 1 },
      { all: 1, todo: 1, 'in-progress': 0, done: 0 },
    ]) {
      state = taskReducer(state, { type: 'advance', id: 'a' })
      expect(countByFilter(state.tasks)).toEqual(counts)
    }
  })
})
