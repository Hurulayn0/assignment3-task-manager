# Final submission review

Full name: Huriye Kayadelen  
Student number: 2200005795  
Project: C:\Users\USER\task-manager  
Review date: 13 November 2026 (Europe/Istanbul)

## Requirements source

This comparison uses the complete R1-R7 and four bonus requirements supplied directly by the student in the conversation. Access to the original CATS HTML returned a login page; the supplied requirement text now provides the basis for verification. No HTML content is fabricated.

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
| 2: Vitest | PASS | Three files, 19 passing tests. Includes all actions, three advances, immutability, helpers, counts, no-op/blank/duplicate edge cases, multiple done tasks and mutations with an active filter. README includes actual test summary. |
| 3: Explain your reducer | PASS | README English explanation is 238 words. Covers pure reducer, external IDs, immutable updates, derived state and pros/cons of reducer-managed filters. |
| 4: Git repository | PARTIAL | More than five meaningful commits, .gitignore, four screenshots and README are present. Complete history is included in assignment3-history.bundle. The real GitHub/GitLab URL is missing because no hosted repository exists and upload was explicitly deferred. This bonus is not claimed complete. |

README begins with full name and student number. The first line of src/taskReducer.ts contains the same identity. GitHub publication has not been performed.

## Real browser screenshots

The visible Microsoft Edge browser runs the actual Vite React app on http://127.0.0.1:5173. Three tasks are entered through the form and advanced through real buttons before screenshots are captured.

| File | Selected filter | Visible tasks |
| --- | --- | --- |
| screenshots/all.png | All | Review reducer lecture notes (To do); Build Task Manager interface (In progress); Write Vitest reducer tests (Done) |
| screenshots/todo.png | To do | Review reducer lecture notes (To do) |
| screenshots/in-progress.png | In progress | Build Task Manager interface (In progress) |
| screenshots/done.png | Done | Write Vitest reducer tests (Done) |

Every view shows counts 3 / 1 / 1 / 1 and exactly one selected filter. The browser script asserts titles, status labels and counts before capture, records PNG SHA-256 hashes and browser version in screenshots/verification.json, and then checks Clear done, delete, Undo, whitespace input, filtered mutations, empty view and mobile overflow. Screenshot capture occurs before later test-only mutations. No screenshot mockups or injected application state are used.

## Final command results

- npm run build: PASS, strict TypeScript and Vite 8.3.8.
- npm run lint: PASS.
- npm test: PASS, 3 files / 19 tests.
- npm run browser: PASS, real Edge interactions and four captures.

## Dependencies and delivery

Previously applied compatible updates fixed two high-severity findings without major upgrades. dependency-audit.json records 10 remaining moderate development-tool findings and zero high/critical. The remaining minimatch-related ESLint dependency changes suggested by npm are breaking changes and were not applied.

assignment3.zip contains tracked source, configuration, tests, README, this report, dependency audit, four PNGs, screenshot evidence and the full Git bundle. node_modules, dist, .git and the ZIP itself are excluded. ZIP contents are compared with source hashes after creation. StudyBuddy was not modified.
