import type { Status, Task } from './taskReducer'

export type Filter = 'all' | Status
export const FILTERS: Filter[] = ['all', 'todo', 'in-progress', 'done']

export function filterTasks(tasks: Task[], filter: Filter): Task[] {
  return filter === 'all' ? tasks : tasks.filter((task) => task.status === filter)
}

export function countByFilter(tasks: Task[]): Record<Filter, number> {
  return tasks.reduce<Record<Filter, number>>((counts, task) => {
    counts.all += 1
    counts[task.status] += 1
    return counts
  }, { all: 0, todo: 0, 'in-progress': 0, done: 0 })
}
