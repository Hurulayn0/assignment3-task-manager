import { describe, expect, it } from 'vitest'
import { initialState, taskReducer } from './taskReducer'
describe('input and history edge cases', () => {
  it('rejects blank titles and duplicate IDs without history changes', () => {
    expect(taskReducer(initialState, {type:'add', id:'1', title:'  '})).toBe(initialState)
    const state=taskReducer(initialState, {type:'add', id:'1', title:' One '})
    expect(state.tasks[0].title).toBe('One')
    expect(taskReducer(state, {type:'add', id:'1', title:'Two'})).toBe(state)
  })
  it('undo reverses add and advance, retaining the selected filter', () => {
    const added=taskReducer(initialState, {type:'add', id:'1', title:'One'})
    const advanced=taskReducer(added, {type:'advance', id:'1'})
    const filtered=taskReducer(advanced, {type:'setFilter', filter:'done'})
    const restored=taskReducer(filtered, {type:'undo'})
    expect(restored.tasks).toEqual(added.tasks)
    expect(restored.filter).toBe('done')
    expect(taskReducer(restored, {type:'undo'}).tasks).toEqual([])
  })
})

// R6: task mutations must remain correct while a non-All filter is active.
describe('mutations with an active filter', () => {
  it('adds, advances and removes without resetting the filter', () => {
    let state = taskReducer(initialState, { type: 'setFilter', filter: 'in-progress' })
    state = taskReducer(state, { type: 'add', id: '1', title: 'Filtered task' })
    expect(state.filter).toBe('in-progress')
    expect(state.tasks[0].status).toBe('todo')
    state = taskReducer(state, { type: 'advance', id: '1' })
    expect(state.filter).toBe('in-progress')
    expect(state.tasks[0].status).toBe('in-progress')
    state = taskReducer(state, { type: 'remove', id: '1' })
    expect(state.filter).toBe('in-progress')
    expect(state.tasks).toEqual([])
  })
  it('clearDone removes every completed task while retaining a different filter', () => {
    const state = { tasks: [
      { id: '1', title: 'A', status: 'done' as const },
      { id: '2', title: 'B', status: 'todo' as const },
      { id: '3', title: 'C', status: 'done' as const },
    ], filter: 'in-progress' as const, past: [] }
    const next = taskReducer(state, { type: 'clearDone' })
    expect(next.tasks.map(task => task.id)).toEqual(['2'])
    expect(next.filter).toBe('in-progress')
    expect(state.tasks).toHaveLength(3)
    expect(taskReducer(next, { type: 'undo' }).tasks).toEqual(state.tasks)
  })
})
