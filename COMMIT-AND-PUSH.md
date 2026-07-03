# Commit & Push — Handoff Rules

> **⚠️ STOP. READ THIS ENTIRE FILE BEFORE TOUCHING ANY CODE.**
> This file exists because work has been committed to the wrong branch before.
> If you are an AI agent (Claude, Codex, GPT, etc.), you MUST read and follow
> every rule in this file before making any changes or commits.

Plain-English rules for making changes to this site without landing them in the
wrong place. Written after work got committed to the wrong branch once and had to
be moved. Read this before you (or any AI agent) commit.

---

## 🚫 DO NOT — The Critical Rules

1. **DO NOT** commit anything until you have confirmed you are on the `main` branch.
2. **DO NOT** use `git add .` or `git add -A` unless you are 100% sure every changed file belongs to this one task.
3. **DO NOT** commit to `holding-page` — that branch is ONLY for the "launching soon" placeholder.
4. **DO NOT** skip `npm run check` before pushing.
5. **DO NOT** guess if you are unsure — stop and ask the user.
6. **DO NOT** merge branches without asking the user first.
7. **DO NOT** use `git checkout --theirs` or `git checkout --ours` during merge conflicts without asking the user which version to keep.

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

## Paste this to an AI agent (Claude, Codex, GPT, or any other)

Copy and paste the block below as the FIRST message to any AI agent working on this repo:

> **MANDATORY INSTRUCTIONS FOR THIS REPO:**
>
> 1. Before doing ANYTHING, read the file `COMMIT-AND-PUSH.md` in the project root. Follow every rule in it.
> 2. Work on the `main` branch ONLY. Run `git branch --show-current` and confirm it says `main` before any commit.
> 3. If you are NOT on `main`, run `git checkout main`. If that fails, run `git worktree prune` first, then try again. If it still fails, STOP and ask the user.
> 4. Before committing: run `git status` and confirm the branch is `main`.
> 5. Stage ONLY the files for this specific task. NEVER use `git add .` or `git add -A` unless the user explicitly says to.
> 6. Run `npm run check` and confirm it passes (exit code 0) before pushing.
> 7. Run `git push origin main` and confirm you see the `main -> main` push line.
> 8. ONE commit = ONE job. Do not bundle unrelated changes.
> 9. If you encounter merge conflicts, STOP and ask the user which version to keep. Do NOT use `--theirs` or `--ours` without asking.
> 10. If anything is ambiguous, STOP and ask instead of guessing.

---

## A note on multiple working copies (worktrees)

> **If you don't understand this section, that's OK. Just follow the rules above and you'll be fine.**

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
