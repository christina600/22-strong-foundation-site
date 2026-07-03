# Commit & Push — Handoff Rules

Plain-English rules for making changes to this site without landing them in the
wrong place. Written after work got committed to the wrong branch once and had to
be moved. Read this before you (or any AI agent) commit.

---

## The mental model: two branches

This repo has two separate copies of the site ("branches"):

| Branch | What it is | Goes live where |
| --- | --- | --- |
| **`main`** | The **real, full website**. This is the source of truth. | Becomes the public site at launch. |
| **`holding-page`** | A temporary **"Launching soon"** placeholder. | Public right now, until launch. |

**The golden rule:** all real website work goes on **`main`**.
Do **not** commit site changes to `holding-page` — it's just the placeholder and
gets retired at launch. Anything committed there is *not* in the launch path.

> What went wrong before: the detailed Transparency page got committed to
> `holding-page` instead of `main`. It looked "done," but the branch that
> actually launches (`main`) never had it. That's the confusion this doc prevents.

---

## Every time, before you commit

**1. Check where you are.**
```bash
git branch --show-current
```
If it does **not** say `main`, switch:
```bash
git checkout main
```
(If it won't switch because of unsaved changes, stop and ask — don't force it.)

**2. See exactly what changed.**
```bash
git status
```
Look at the list. If you see files you *didn't* mean to change, don't commit them.

**3. Stage only what belongs to this task.**
```bash
git add path/to/the-file-you-changed.astro
```
Name the files. Avoid `git add .` when other unrelated work is sitting in the
folder — that's how unrelated changes get swept into the wrong commit.

> What went wrong before: a Transparency commit also pulled in unrelated donation
> ($22 ladder) changes because everything got added at once. One commit = one job.

**4. Check it still builds.** This is the same check the site's CI runs:
```bash
npm run check
```
It must finish with no errors (exit code 0). If it fails, fix it before pushing.

**5. Commit with a clear message.**
```bash
git commit -m "Short description of what this change does"
```

**6. Push, and confirm it landed.**
```bash
git push origin main
```
Success looks like a line such as `5104141..83603ab  main -> main`.
If you don't see that, it didn't push.

---

## One commit = one job

Keep each commit to a single, describable change. Don't mix, e.g., a Transparency
page edit with donation-amount tweaks. If two unrelated things are in progress at
once, commit them separately so each can be reviewed and undone on its own.

---

## Paste this to an AI agent (Claude or Codex)

> Work on the `main` branch only. Before committing: run `git status` and confirm
> the branch is `main`; stage **only** the files for this specific task (don't
> `git add .` if unrelated changes are present); run `npm run check` and confirm it
> passes; then `git push origin main` and confirm the `main -> main` push line.
> Do not bundle unrelated in-progress changes into the commit. If anything is
> ambiguous, stop and ask instead of guessing.

---

## A note on multiple working copies (worktrees)

There is sometimes a second checkout of this repo on the machine (for example under
`/private/tmp/…`) so an agent can work on `main` while the main folder stays on
`holding-page`. That's fine — but it means the same branch can be open in two
places. Before committing, always confirm **which folder and which branch** you're
in (step 1), and don't commit into a folder that has someone else's work in
progress.

### If `git checkout main` says "already checked out" somewhere else

This means a stale worktree reference exists (the folder was deleted but git still
thinks it's there). Fix it with:
```bash
git worktree prune
```
Then try `git checkout main` again. This happened in July 2026 when the
`/private/tmp/22-strong-main-for-deploy` worktree was removed but the reference
lingered, blocking all branch switches until `git worktree prune` cleaned it up.

---

## Deploy reality (why `main` has to be complete)

The public domain currently serves the **`holding-page`** placeholder via Netlify.
At launch, Netlify's production branch flips to **`main`**. So whatever is on
`main` at that moment is what the world sees — which is why every real change has
to be there, verified, and pushed.
