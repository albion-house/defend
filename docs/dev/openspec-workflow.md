---
title: openspec workflow
summary: how we make and finish scoped changes.
order: 15
---

# openspec workflow

most project changes follow this loop:

```text
propose -> apply -> sync -> archive
```

commit after each stage.

keep the worktree clean before moving to the next one.

after apply, run the site and look at the actual result in a browser. fix what is visibly wrong before calling the implementation done.
