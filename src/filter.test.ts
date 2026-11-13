import { describe, it, expect } from 'vitest'
import { countByFilter, filterTasks } from './filter'
import type { Task } from './taskReducer'
const tasks: Task[] = [
  { id: '1', title: 'A', status: 'todo' },
  { id: '2', title: 'B', status: 'in-progress' },
  { id: '3', title: 'C', status: 'done' },
  { id: '4', title: 'D', status: 'todo' },
]
describe('filter utilities', () => {
  it('returns all tasks for all', () => expect(filterTasks(tasks, 'all')).toBe(tasks))
  it('selects only matching tasks', () => {
    expect(filterTasks(tasks, 'todo').map(t => t.id)).toEqual(['1', '4'])
    expect(filterTasks(tasks, 'in-progress').map(t => t.id)).toEqual(['2'])
    expect(filterTasks(tasks, 'done').map(t => t.id)).toEqual(['3'])
  })
  it('counts each filter', () => expect(countByFilter(tasks)).toEqual({ all: 4, todo: 2, 'in-progress': 1, done: 1 }))
  it('counts empty lists', () => expect(countByFilter([])).toEqual({ all: 0, todo: 0, 'in-progress': 0, done: 0 }))
  it('recounts after delete', () => expect(countByFilter(tasks.filter(t => t.id !== '1')).todo).toBe(1))
})
