# Final submission review

Full name: Huriye Kayadelen  
Student number: 2200005795  
Project: C:\Users\USER\task-manager  
Review date: 14 November 2026 (Europe/Istanbul)

## Review basis

Checked against the R1-R7 and four-bonus checklist recorded in this project, plus the current submission cleanup instructions. The original assignment document is not present locally, so an independent word-for-word comparison with that document is not claimed.

## Requirement-by-requirement comparison

| Requirement | Result | Code and verification |
| --- | --- | --- |
| R1 | PASS | src/taskReducer.ts exports State, initialState and taskReducer. State includes tasks, filter and bonus past. src/filter.ts exports Filter with all/todo/in-progress/done. Initial tasks are empty and filter is all. App calls useReducer(taskReducer, initialState). |
| R2 | PASS | Action union and reducer handle add, advance, remove, setFilter and clearDone. App has a Clear done button. Unit test clears multiple completed tasks while a different filter is active and confirms that filter stays selected. |
| R3 | PASS | Reducer uses spread/map/filter for immutable updates. No random or clock calls occur inside it. UUID generation is in the form event handler. assertNever receives the default switch branch to enforce exhaustive actions. Immutability and Undo are tested. |
| R4 | PASS | src/filter.ts imports only types, has no React runtime dependency, and implements pure filterTasks/countByFilter. Tests check all filters, counts and empty input. |
| R5 | PASS | FilterBar has All, To do, In progress and Done buttons dispatching setFilter. Selected filter uses a distinct style and aria-pressed. Browser checks exact visible titles and statuses for each filter. |
| R6 | PASS | App derives visible and counts during render. State does not duplicate those values. Browser checks add while In progress is selected, advance out of that view, empty message, remove while Done is selected, and updated counters. Unit tests also verify filtered mutations retain the filter. |
| R7 | PASS | strict is enabled in app and node TypeScript configs. npm run build passes. Source scan finds no explicit any type. No Context API or Zustand is used; typed props/callbacks pass data to children. |

## Bonuses and identity

| Bonus | Result | Evidence |
| --- | --- | --- |
| 1: Undo | PASS | past: Task[][], undo action, disabled button without history, filter changes excluded from history, clearDone reversible. Unit tests and real browser checks pass. |
| 2: Vitest | PASS | Four files, 40 passing tests; the original 19 are preserved and 21 distinct additional cases were added. Includes all actions, three advances, immutability, helpers, counts, no-op/blank/duplicate edge cases, multiple done tasks and mutations with an active filter. README includes actual test summary. |
| 3: Explain your reducer | PASS | README English explanation is 238 words. Covers pure reducer, external IDs, immutable updates, derived state and pros/cons of reducer-managed filters. |
| 4: Git repository | PASS | More than five meaningful commits, .gitignore, four screenshots and README are present. Real public repository: https://github.com/Hurulayn0/assignment3-task-manager. All existing commits are preserved without history rewriting. Complete history is included in assignment3-history.bundle. The repository is publicly accessible. |

README begins with full name and student number. The first line of src/taskReducer.ts contains the same identity. GitHub publication was subsequently authorized. Repository: https://github.com/Hurulayn0/assignment3-task-manager (public). The existing history was preserved without rewriting commits.

## Validation and delivery

- npm run build: PASS, standard TypeScript and Vite production build.
- npm run lint: PASS.
- npm test: PASS, all 40 tests across four files, unchanged by cleanup.
- npm run browser: PASS, visible Edge check against http://localhost:5173/; Add, full status cycle, Delete, four filters, counts, Clear done, Undo, blank input and mobile overflow.
- Four original PNGs retained unchanged: all.png, todo.png, in-progress.png, done.png.

The final ZIP is checked for required source, tests, configuration, package files, README, four screenshots and complete Git bundle. node_modules, dist, generated HTML, audit/verification JSON, raw test output and this local review note are excluded. Unused starter CSS/images and standalone build support were removed. No test, reducer or application behavior was removed. StudyBuddy was not modified.
