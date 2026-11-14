**Full name:** Huriye Kayadelen  
**Student number:** 2200005795

# Assignment 3 - Task Manager

React + TypeScript implementation based on the existing Vite starter. The R1-R7 checklist and four bonus implementations are described below.

## Run

Use Node.js 22.12+ (validated with Node 24).

```sh
npm install
npm run dev
npm run build
npm run lint
npm test
```

After npm install, run npm run dev and open http://localhost:5173/. The root index.html is the Vite entry; the dev server compiles the React and TypeScript source. npm run build produces the normal production build in dist; npm run preview serves that build locally. Generated build files are excluded from the submission ZIP.

Tasks are held in memory. Refreshing starts an empty session.

## R1-R7 checklist

| Requirement | Implementation |
| --- | --- |
| R1 | Exported State, initialState and taskReducer; State holds tasks, filter and bonus past; App uses useReducer(taskReducer, initialState). |
| R2 | Typed add, advance, remove, setFilter and clearDone actions; Clear done removes every completed task and preserves the filter. |
| R3 | Immutable, deterministic reducer; IDs generated in the form handler; exhaustive never check. |
| R4 | React-free pure filterTasks and countByFilter in src/filter.ts. |
| R5 | Four filter buttons dispatch setFilter, highlight selection and display matching tasks. |
| R6 | Live counts and visible list derived during render; mutations work with filters active; empty views display No tasks here. |
| R7 | Strict TypeScript build passes; no explicit any type in project source. |

App passes typed props and callbacks to child components. Context API and Zustand are not used.

## Bonus 1: Undo

State includes past: Task[][] and an undo action. Effective task changes save the previous task array. Filter changes and no-op actions do not add history. Undo keeps the current filter, restores clearDone results and is disabled when history is empty.

## Bonus 2: Vitest tests

All 19 existing tests are preserved. 21 additional cases bring the total to 40: appending tasks, all four filter transitions, empty/all-done clearing, nonempty history edge cases, successive Undo across every edit, edits after Undo, frozen states/objects/history for every mutation and Undo, filtered operations, empty filters and counters through the full status cycle. Latest actual test summary:

```text
Test Files  4 passed (4)
     Tests  40 passed (40)
```

Final validation on 14 November 2026: npm run build, npm run lint and npm test passed. With Vite running, npm run browser checks Add, the complete Next cycle, Delete, all four filters, counts, Clear done, Undo for every edit type, consecutive Undo, whitespace rejection and mobile overflow in visible Microsoft Edge. The browser check preserves the four original PNGs and does not generate report files.

## Bonus 3: Explain your reducer

A reducer calculates the next state from the current state and an action. It is pure: it does not change its input, generate random IDs, read a clock or perform network requests. Given the same inputs, it produces the same result. This makes behavior predictable and allows the tests to exercise transitions without rendering React.

For an advance action, map creates a new tasks array and a new object for the changed task. Unchanged task objects can be reused. Removal and clearing use filter; addition uses a spread. React can detect the changed references, and the previous task arrays remain valid Undo snapshots. Mutating a task in place would also corrupt history that shares that object.

IDs are created with crypto.randomUUID() in the form event handler before dispatch. The reducer therefore receives the ID as data and remains deterministic, including when React StrictMode invokes it again during development.

The filtered list and counts are derived during rendering rather than stored independently. Storing these results would duplicate information: deleting a task could otherwise leave the count or filtered list stale. A single tasks array remains the source of truth.

Keeping the selected filter in reducer state centralizes transitions in one typed action union. The tradeoff is a small amount of action boilerplate compared with a separate state hook. For this application, the explicit transitions and testability justify it. Undo only changes tasks so the user's current view stays selected.

## Bonus 4: Git repository

The local repository has more than five meaningful commits and a .gitignore excluding node_modules, dist and generated archives. Complete history is included as assignment3-history.bundle. Restore with:

```sh
git clone assignment3-history.bundle task-manager
```

**GitHub repository:** https://github.com/Hurulayn0/assignment3-task-manager

Existing Git history is preserved without rewriting commits. Local history, ignore rules, four screenshots, README and the real hosted repository link are included. The repository is public and can be viewed without collaborator access.

## Screenshots

Four real Edge captures are included: screenshots/all.png, todo.png, in-progress.png and done.png. The three tasks are Review reducer lecture notes (To do), Build Task Manager interface (In progress) and Write Vitest reducer tests (Done). Counts are 3 / 1 / 1 / 1. These four PNGs are preserved unchanged. The browser script checks the same titles, statuses and selected filters without overwriting them.

## Submission

assignment3.zip contains the React/TypeScript source, all four Vitest test files (40 cases), Vite/TypeScript/ESLint configuration, package.json, package-lock.json, source index.html, required favicon, browser check script, README, four PNGs and assignment3-history.bundle. The bundle preserves the complete Git history; the GitHub link above is retained.

The ZIP excludes node_modules, dist, generated HTML, audit/verification reports, raw test output, local review notes, .git and the ZIP itself.
