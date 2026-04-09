# SEC LI BOT

Expanded React prototype for the SEC LinkedIn content bot, built from the supplied `linkedin-post-bot.jsx` baseline.

## What is included

- A multi-tab SEC-themed React app with dashboard, strategy, intel, studio, queue, knowledge, roadmap and settings views.
- Local-first workspace persistence in browser storage.
- Prompt pack generation aligned to a LinkedIn ghostwriting workflow.
- Draft scoring against guardrails for tone, length, hashtags, CTA coverage, risky phrases and repetition.
- Seeded/manual intel capture and a webhook hand-off path for future backend AI integration.
- Queueing, scheduling and a lightweight LinkedIn publish connector stub.

## Run locally

```bash
npm install
npm run dev
```

## Notes

- The Word documents provided in `Downloads` appear to be placeholder shells rather than full written specifications, so this implementation uses their document structure plus the existing JSX behavior as the requirements baseline.
- The LinkedIn publish action is kept as a prototype connector. In practice, it should be routed through a backend service rather than called directly from the browser.
