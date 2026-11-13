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
