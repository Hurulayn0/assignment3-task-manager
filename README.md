# Assignment 3 — Task Manager

**Full name:** Huriye Kayadelen  
**Student number:** 2200005795

React + TypeScript application developed directly in the existing Vite starter.

## Run

Use Node.js 22.12+ (validated with Node 24).

```sh
npm install
npm run dev
npm run build
npm test
npm run lint
```

Open the local address printed by Vite. Tasks are intentionally held in memory; refreshing starts an empty session.

## Implemented behavior

- App owns `tasks`, `filter`, and Undo history with `useReducer` and passes typed props to children.
- A discriminated `Action` union supports add, advance, remove, setFilter, clearDone and undo.
- New tasks have an externally generated ID, a trimmed title and To do status. Blank titles and duplicate IDs are ignored.
- Next cycles To do → In progress → Done → To do. Delete removes the selected task.
- All, To do, In progress and Done show live counts and an accessible pressed state.
- Pure `filterTasks` and `countByFilter` derive the displayed list and counts.
- Empty views show a message. Clear done removes completed tasks, including when another filter is selected.
- Strict TypeScript, exhaustive action handling, immutable updates and no `any` in application code.

The original `Assignment_3_Week5_TaskManagerReducer.html` was not present at the supplied path during implementation. The above checklist follows the Assignment 3 source material in the existing downloaded assignment ZIP. Exact R1–R7 numbering, bonus wording and submission rules must be compared with the original HTML when available; this README does not claim that comparison occurred.

## Bonus 1: Undo

Each effective task change appends the previous task array to `past`. Undo restores the most recent snapshot and removes it from history. It preserves the currently selected filter. Changing filters, unknown task IDs, blank submissions and other operations that do not change tasks do not create snapshots. Undo is disabled when history is empty.

## Bonus 2: Vitest tests

Vitest covers all actions, the complete status cycle, filtering and counts, empty input, unknown IDs, duplicate IDs, reference immutability and sequential Undo. `scripts/browser-check.mjs` additionally drives real Edge through the form, status buttons and four filters; checks Clear done, deletion, Undo, empty input, browser errors and mobile overflow; and captures the four screenshots. Run it with `node scripts/browser-check.mjs` while the development server runs on port 5173. It requires Microsoft Edge installed on Windows.

## Bonus 3: Explain your reducer

A reducer calculates the next state from the current state and an action. It is pure: it does not change its input, generate random IDs, read a clock or perform network requests. Given the same inputs, it produces the same result. This makes behavior predictable and allows the tests to exercise transitions without rendering React.

For an advance action, `map` creates a new tasks array and a new object for the changed task. Unchanged task objects can be reused. Removal and clearing use `filter`; addition uses a spread. React can detect the changed references, and the previous task arrays remain valid Undo snapshots. Mutating a task in place would also corrupt history that shares that object.

IDs are created with `crypto.randomUUID()` in the form event handler before dispatch. The reducer therefore receives the ID as data and remains deterministic, including when React StrictMode invokes it again during development.

The filtered list and counts are derived during rendering rather than stored independently. Storing these results would duplicate information: deleting a task could otherwise leave the count or filtered list stale. A single tasks array remains the source of truth.

Keeping the selected filter in reducer state centralizes transitions in one typed action union. The tradeoff is a small amount of action boilerplate compared with a separate state hook. For this application, the explicit transitions and testability justify it. Undo only changes tasks so the user's current view stays selected.

## Bonus 4: Git repository

The local repository records the original starter, application implementation, tests and final delivery documentation as separate meaningful commits. The delivery includes `assignment3-history.bundle`; restore it using `git clone assignment3-history.bundle task-manager`.

GitHub publication requires an authenticated account and a remote repository. No GitHub URL is invented and no publication is claimed. Local Git history completes the preparatory work for that bonus.

## Screenshots and submission

`screenshots/all.png`, `todo.png`, `in-progress.png` and `done.png` are generated from a real browser after three tasks are added through the UI, with one task in each status. Screenshots are not drawn mockups.

`assignment3.zip` contains an `assignment3/` project folder, source, configuration, lockfile, tests, screenshots and this README. It excludes node_modules, build output, .git and itself. The Git bundle preserves history separately inside the deliverable.

## Verified results

- `npm install`: completed using Windows system CAs (`NODE_USE_SYSTEM_CA=1`) with TLS verification enabled.
- `npm run build`: passed (TypeScript and Vite).
- `npm test`: 3 test files, 17 tests passed.
- `npm run lint`: passed.
- `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`: started successfully.
- Real Microsoft Edge browser checks passed; all four PNG files were captured from UI interactions.

Final review: compatible security updates upgraded Vite 8.3.2 to 8.3.8 and Zod 4.6.5 to 4.6.7. Audit now reports 10 moderate development-tool vulnerabilities, zero high and zero critical. npm suggests breaking changes for the remaining minimatch-related ESLint dependency chain; these were not applied. No --force or major-version upgrades were used. See dependency-audit.json and FINAL_REVIEW.md.


Final review: 13 November 2026 (Europe/Istanbul). All checks were repeated after security updates. Six meaningful local commits are included in the final Git bundle. GitHub upload has not been performed.

Screenshot content and SHA-256 hashes are recorded in screenshots/verification.json. The browser script verifies the exact titles, status labels, selected filter, counts and number of rows before each capture.
