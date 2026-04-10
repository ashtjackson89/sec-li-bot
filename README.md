# SEC LI BOT

SEC LI BOT is a React-based LinkedIn content workflow app for Strategic Edge Consulting. It helps plan content, capture intel, generate LinkedIn draft prompts, score draft quality, manage a publishing queue, and prepare the app for future backend AI and LinkedIn integrations.

This repo is intended to be easy to run locally and easy to extend.

## What The App Does

- Build a content brief around audience, objective, tone, format, topics, and CTA
- Capture seeded and manual intel items that can influence post generation
- Generate a prompt pack for a LinkedIn ghostwriting workflow
- Create draft variants in demo mode or send generation requests to a webhook
- Score drafts against guardrails such as word count, CTA quality, risky claims, and repetition
- Move drafts through review, scheduling, and publishing states
- Store workspace data locally in the browser so progress is not lost between refreshes

## Main Screens

- `Dashboard`: high-level campaign and workflow summary
- `Strategy`: set audience, objective, topics, tone, and CTA
- `Intel`: manage source signals and manual insight capture
- `Studio`: review prompt pack, generate variants, edit drafts, and score them
- `Queue`: manage approval, scheduling, and publishing status
- `Knowledge`: inspect repeated topics and keyword patterns
- `Roadmap`: project roadmap and backlog view
- `Settings`: profile, guardrails, webhook settings, and LinkedIn settings

## Tech Stack

- React 18
- Vite 5
- Plain CSS
- Browser `localStorage` for local persistence

## Project Structure

```text
.
├── index.html
├── package.json
├── linkedin-post-bot.jsx
└── src
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

## Important Files

- `src/App.jsx`
  The main application. Nearly all workflow logic, UI state, draft scoring, and screen rendering lives here.

- `src/main.jsx`
  Entry point that mounts the React app.

- `src/index.css`
  All visual styling for the current SEC interface.

- `index.html`
  App shell plus a boot-error overlay that helps surface browser startup errors instead of leaving a blank page.

- `linkedin-post-bot.jsx`
  Compatibility export pointing at the main app.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the app

```bash
npm run dev
```

Then open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Windows PowerShell Note

If PowerShell blocks `npm.ps1`, use:

```powershell
cmd /c npm install
cmd /c npm run dev
```

This is the safest way to run the project on machines where PowerShell execution policy is restricted.

## How To Use The App

### Basic workflow

1. Open `Settings` and confirm your profile, topics, and guardrails.
2. Go to `Strategy` and define the campaign brief.
3. Add or select signals in `Intel`.
4. Open `Studio` and generate variants.
5. Edit the draft and review the guardrail findings.
6. Queue the draft for review or scheduling.
7. Use `Queue` to move the post through approval and publishing.

## Current Generation Modes

### Demo mode

Demo mode generates realistic placeholder LinkedIn draft variants inside the browser. It is useful for:

- local testing
- UI development
- prompt workflow review
- app demos without a backend

### Webhook mode

Webhook mode sends the prompt pack and app state to your own backend endpoint. This is the intended path for real model integration.

The webhook payload includes:

- profile
- brief
- guardrails
- selected intel
- prompt pack
- model label if configured

## Extension Points For Developers

If you want to implement more functionality, these are the main places to start:

- `buildPromptPack(...)` in `src/App.jsx`
  Controls how the prompt is assembled from strategy, guardrails, and intel.

- `createDemoDrafts(...)`
  Creates local draft variants used when webhook mode is not enabled.

- `generateFromWebhook(...)`
  Sends generation requests to an external endpoint.

- `evaluateDraft(...)`
  Scores drafts for length, CTA quality, hashtag count, banned phrases, risky claims, and repetition.

- `publishToLinkedIn(...)`
  Prototype publish action. In production, this should move to a backend service rather than being called directly from the browser.

## Data And Persistence

- Workspace state is stored in browser `localStorage`
- Export and import are supported from inside the app
- Secrets can optionally be persisted locally, but this is only suitable for local prototype use

## Troubleshooting

### Blank screen on load

The app includes an HTML boot-error overlay in `index.html`. If the app fails very early, it should now show the actual error instead of leaving a blank page.

### React boot issues

If the browser shows a boot error, check:

- browser console
- `index.html` boot overlay message
- the latest generated bundle after `npm run build`

### Nothing happens when opening `index.html` directly

This app should be run through Vite, not opened directly from the file system.

Use:

```bash
npm run dev
```

or:

```bash
npm run preview
```

## Implementation Notes

- The original Word documents supplied alongside the project appear to be placeholder shells rather than detailed specifications.
- This implementation uses the document structure plus the supplied `linkedin-post-bot.jsx` behavior as the baseline.
- The current LinkedIn publishing flow is a prototype connector, not a hardened production integration.

## Future Improvements

- Move all AI and LinkedIn actions to a backend API
- Break `src/App.jsx` into smaller feature components
- Add tests for draft scoring and prompt assembly
- Add campaign analytics and post-performance feedback loops
- Add authenticated user storage instead of browser-only persistence
