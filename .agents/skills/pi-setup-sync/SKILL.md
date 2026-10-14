---
name: pi-setup-sync
description: Sync the active Pi extensions and setup files into the my_pi Git repository, review changes, and commit or push them when explicitly requested. Use when saving, backing up, or moving this Pi setup between computers.
---

# Pi setup sync

The canonical repository is `$HOME/jackz/code-projects/my_pi`. The active user extensions are in `$HOME/.pi/agent/extensions`.

## Sync active extensions into the repository

Run:

```bash
mkdir -p "$HOME/jackz/code-projects/my_pi/extensions"
rsync -a --delete "$HOME/.pi/agent/extensions/" "$HOME/jackz/code-projects/my_pi/extensions/"
```

Then inspect the result:

```bash
git -C "$HOME/jackz/code-projects/my_pi" status --short
git -C "$HOME/jackz/code-projects/my_pi" diff -- extensions
```

Do not delete or overwrite unrelated repository files. The sync source is the active extensions directory, and the repository's `extensions/` directory should mirror it.

## Commit and push

Never push without the user explicitly asking to save, commit, sync, or push the setup. Before committing, show or summarize the changed files and confirm that no secrets or session history are included.

Use a descriptive commit message, then:

```bash
git -C "$HOME/jackz/code-projects/my_pi" add extensions README.md .agents/skills
git -C "$HOME/jackz/code-projects/my_pi" commit -m "Update pi setup"
git -C "$HOME/jackz/code-projects/my_pi" push
```

If GitHub authentication fails, stop and report the exact error. Do not put tokens or passwords in remotes, files, or command arguments.

## Restore on another computer

After cloning the repository, copy the tracked extensions into the active directory:

```bash
mkdir -p "$HOME/.pi/agent/extensions"
rsync -a "$HOME/jackz/code-projects/my_pi/extensions/" "$HOME/.pi/agent/extensions/"
```

Restart Pi after installing or changing extensions. Existing session history is separate and is not synced by this skill.
