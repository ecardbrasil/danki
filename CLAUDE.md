# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Danki** is a Portuguese-language intelligent flashcard app (similar to Anki) built as a pure browser-based React application — no build step, no package manager, no Node.js required.

## Running the App

Open `index.html` directly in a browser, or serve it with any static file server:

```bash
npx serve .
# or
python -m http.server 8080
```

React 18 and Babel are loaded via CDN. JSX is transpiled in the browser at runtime.

## Architecture

### No Build Pipeline

All `.jsx` files are loaded as `type="text/babel"` script tags in `index.html`. Babel standalone compiles them client-side. There is no bundler, no `node_modules`, no `package.json`.

### Screen Routing

Routing is a single `useState("dashboard")` in `app.jsx`. The `switch` in `App()` maps the current screen string to its component. Screens that aren't implemented yet fall back to `"dashboard"`. To add a new screen: add its key to `SCREEN_CRUMBS`, add a case to the switch, and add a nav entry in the Sidebar.

### File Responsibilities

| File | Role |
|------|------|
| `index.html` | Entry point; loads CDN scripts and all `.jsx` modules |
| `app.jsx` | Root `App` component — routing only |
| `components.jsx` | Shared primitives: `Icon`, `BrandMark`, `Sidebar`, `Topbar`, `Button` |
| `screens-dashboard.jsx` | Hero stats, particle canvas, study streak heatmap |
| `screens-decks.jsx` | Deck list and card counts |
| `screens-study.jsx` | Flashcard flip/review session |
| `screens-ai-create.jsx` | AI-powered card generation UI |
| `screens-editor.jsx` | Manual card editor |
| `screens-chat.jsx` | AI chat interface |
| `styles.css` | All styling — custom CSS variables, animations, responsive grid |

### State

All state is local `React.useState`. There is no global store, no persistence layer, and no backend integration (the AI screens are UI stubs).

### Styling

`styles.css` defines a custom design system using CSS variables (`--color-*`, `--space-*`, `--radius-*`, etc.). Use these variables rather than hardcoded values. Animations use `@keyframes stagger-up` and `@keyframes fade-in` defined there.
