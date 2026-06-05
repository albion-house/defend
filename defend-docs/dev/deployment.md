---
title: deployment
summary: how the public build reaches github pages.
order: 13
---

# deployment

github actions builds the astro site and uploads `web/dist/` to github pages.

the build receives a version made from the root package version and the current commit.

after deployment, playwright opens the public play route. it waits for the expected version and checks that the beginning of the game is playable.
