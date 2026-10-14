---
name: subagent-routing
description: Route work between direct tools, a single subagent, parallel subagents, and coordinated workflows. Use when deciding how to delegate a task or when the user asks for subagent help.
---

# Subagent routing

Prefer the least expensive approach that preserves quality:

1. Use direct tools for small, known, sequential work.
2. Default to one `subagent` call for focused investigation, planning, review, or implementation that benefits from isolated context.
3. Use parallel subagents only for independent tasks.
4. Use coordinated workflows only when the task is multi-phase, ambiguous, or needs synthesis and progress tracking.

## Single-agent default

Choose the narrowest suitable agent:

- `scout`: inspect a codebase or locate relevant code; do not modify files.
- `planner`: produce an implementation plan; do not modify files.
- `worker`: implement a focused task or handle a general task.
- `reviewer`: inspect changes and report correctness, security, and test concerns.

Example:

```json
{"agent":"scout","task":"Find all authentication entry points and summarize the current flow."}
```

## Escalate to coordination

Use a chain when outputs depend on one another:

```text
scout -> planner -> worker -> reviewer
```

Use parallel execution when tasks do not touch shared mutable state. Keep implementation tasks sequential when they may edit the same files.

Available workflow commands:

- `/scout-and-plan <goal>` — reconnaissance followed by planning.
- `/implement <goal>` — reconnaissance, planning, then implementation.
- `/implement-and-review <goal>` — implementation, review, then follow-up implementation.

After delegated work, synthesize the results in the main thread. Report completed, running, failed, and queued work, plus important files, decisions, and recommended next steps.

Do not delegate trivial edits, simple reads, or commands whose result is immediately needed for the next direct action. Delegation adds process startup time, model cost, and another context boundary.
