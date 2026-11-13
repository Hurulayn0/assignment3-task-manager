# Final submission review — 13 November 2026

Project: C:\Users\USER\task-manager

## Original assignment access

Assignment_3_Week5_TaskManagerReducer.html was not found in the project or the searched Desktop/Downloads locations. An exact filename web search returned no results. No CATS resource URL was supplied, so its content could not be retrieved. The requested link remains outstanding. The original assignment requirements have not been read, and no wording or numbering is invented below.

| Original requirement | Result of comparison with original HTML |
| --- | --- |
| R1 | Unverified: original text unavailable |
| R2 | Unverified: original text unavailable |
| R3 | Unverified: original text unavailable |
| R4 | Unverified: original text unavailable |
| R5 | Unverified: original text unavailable |
| R6 | Unverified: original text unavailable |
| R7 | Unverified: original text unavailable |

## Code and behavior independently verified

| Area | Implementation and evidence |
| --- | --- |
| State and action types | src/taskReducer.ts: Task, Status, State, discriminated Action union, exhaustive never check |
| Pure immutable reducer | taskReducer.ts uses new arrays/objects, receives IDs externally; taskReducer.test.ts verifies immutability |
| Add / advance / remove | App.tsx AddForm, TaskRow.tsx buttons, reducer cases; Vitest and real Edge pass |
| Filter helpers | src/filter.ts: filterTasks, countByFilter; filter.test.ts verifies each status and counts |
| Filter controls | App.tsx FilterBar: four labels, aria-pressed, derived counts; exact titles and status labels checked in Edge |
| List and bulk removal | App.tsx TaskList and empty message; clearDone removes completed tasks; Edge verifies clear and restore |
| React and TypeScript | App owns useReducer; typed child props; strict compiler settings; build and lint pass |

## Bonus review

1. Undo: implemented and verified for additions, advances, deletion and clearDone. Filter changes do not consume history. Empty history is safe; current filter is retained.
2. Vitest tests: three test files, 17 tests passed after dependency updates. Covers all reducer actions, status cycle, filtering/counts, no-op actions, blank titles, duplicate IDs, immutability and sequential Undo.
3. Explain your reducer: README explains purity, immutable references, external ID generation, derived state, filter state tradeoffs and Undo snapshots. Full name and student number are explicit and also present in the reducer header.
4. Git repository: six meaningful commits including original starter, implementation, tests, screenshots, compatible security updates and final review. Bundle preserves the complete history. No remote is configured and nothing was uploaded to GitHub. Hosted repository portion remains pending, as requested.

## Screenshot verification

Real visible Microsoft Edge was controlled with Playwright against the running Vite React application on http://127.0.0.1:5173/. Three tasks were entered via the form; status changes used the actual buttons. No localStorage injection or static image generation was used.

| PNG | Selected filter | Exact visible tasks |
| --- | --- | --- |
| all.png | All | Review reducer lecture notes (To do); Build Task Manager interface (In progress); Write Vitest reducer tests (Done) |
| todo.png | To do | Review reducer lecture notes (To do) |
| in-progress.png | In progress | Build Task Manager interface (In progress) |
| done.png | Done | Write Vitest reducer tests (Done) |

All views show counts 3 / 1 / 1 / 1. Exact row titles, labels and pressed state are asserted before capture. All four PNGs were visually inspected. screenshots/verification.json records browser version, capture time and image hashes. Browser checks also cover clearDone, delete, Undo, blank input, mobile overflow and page errors.

## Final command results

- npm run build: passed with Vite 8.3.8 and strict TypeScript.
- npm run lint: passed.
- npm test: 3 files and 17 tests passed.
- npm run browser: passed; four screenshots recreated.
- npm audit: 10 moderate, 0 high, 0 critical; nonzero audit exit indicates remaining findings, not a build/test failure.

## Dependency review

Compatible updates only: Vite 8.3.2 → 8.3.8, Zod 4.6.5 → 4.6.7, ESLint 10.12.0 → 10.14.0 and related compatible transitive updates. No major-version upgrade and no --force were used. The remaining minimatch denial-of-service advisory propagates through the development-only ESLint/typescript-eslint chain. npm proposes breaking changes; these were deliberately left pending user approval. Full machine-readable report: dependency-audit.json.

During the update, npm reported a Windows file-lock cleanup warning for an old native bundler binary used by the then-running dev server. The server was stopped and restarted with the updated dependencies; final build, lint, tests and browser checks all passed. The delivery excludes node_modules entirely.

## Delivery boundaries

assignment3.zip includes the project, README, this review, tests, four screenshots, verification JSON, dependency report and complete Git history bundle. It excludes node_modules, dist, .git and the ZIP itself. ZIP entries and screenshot hashes are checked after creation. StudyBuddy was not modified. Exact R1–R7 compliance remains blocked only by the missing original assignment text; the ZIP must not be described as instructor-specification verified until that comparison is possible.
