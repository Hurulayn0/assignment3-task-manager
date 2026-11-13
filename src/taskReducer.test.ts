import { describe, expect, it } from 'vitest'
import { initialState, taskReducer, type State } from './taskReducer'

const withThree = (): State => {
  let s = taskReducer(initialState, { type: 'add', id: '1', title: 'Study' })
  s = taskReducer(s, { type: 'add', id: '2', title: 'Code' })
  return taskReducer(s, { type: 'add', id: '3', title: 'Read' })
}

describe('taskReducer', () => {
  it('starts empty with all filter', () => expect(initialState).toEqual({ tasks: [], filter: 'all', past: [] }))
  it('adds a todo task', () => expect(taskReducer(initialState, { type: 'add', id: '1', title: 'One' }).tasks).toEqual([{ id: '1', title: 'One', status: 'todo' }]))
  it('advances three times back to todo', () => {
    let s = withThree()
    for (const status of ['in-progress', 'done', 'todo']) {
      s = taskReducer(s, { type: 'advance', id: '1' })
      expect(s.tasks[0].status).toBe(status)
    }
  })
  it('removes one task', () => expect(taskReducer(withThree(), { type: 'remove', id: '2' }).tasks.map(t => t.id)).toEqual(['1', '3']))
  it('sets filter without modifying tasks or undo history', () => {
    const s = withThree()
    const next = taskReducer(s, { type: 'setFilter', filter: 'done' })
    expect(next.tasks).toBe(s.tasks)
    expect(next.past).toBe(s.past)
    expect(next.filter).toBe('done')
  })
  it('clears completed tasks, keeps filter and undo can restore them', () => {
    let s = taskReducer(withThree(), { type: 'advance', id: '1' })
    s = taskReducer(s, { type: 'advance', id: '1' })
    s = taskReducer(s, { type: 'setFilter', filter: 'done' })
    const cleared = taskReducer(s, { type: 'clearDone' })
    expect(cleared.tasks.map(t => t.id)).toEqual(['2', '3'])
    expect(cleared.filter).toBe('done')
    expect(taskReducer(cleared, { type: 'undo' }).tasks).toEqual(s.tasks)
  })
  it('undo does nothing without history', () => expect(taskReducer(initialState, { type: 'undo' })).toBe(initialState))
  it('ignores unknown ids and clearDone with no done tasks', () => {
    const s = withThree()
    expect(taskReducer(s, { type: 'advance', id: 'missing' })).toBe(s)
    expect(taskReducer(s, { type: 'remove', id: 'missing' })).toBe(s)
    expect(taskReducer(s, { type: 'clearDone' })).toBe(s)
  })
  it('does not mutate the previous state, tasks or task objects', () => {
    const s = withThree()
    const before = structuredClone(s)
    const next = taskReducer(s, { type: 'advance', id: '1' })
    expect(s).toEqual(before)
    expect(next).not.toBe(s)
    expect(next.tasks).not.toBe(s.tasks)
    expect(next.tasks[0]).not.toBe(s.tasks[0])
    expect(next.tasks[1]).toBe(s.tasks[1])
  })
  it('undo reverses a removal', () => {
    const s = withThree()
    expect(taskReducer(taskReducer(s, { type: 'remove', id: '1' }), { type: 'undo' }).tasks).toEqual(s.tasks)
  })
})
