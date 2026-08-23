# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **static website** (GitHub Pages) for "50+ TechBridge" / Learn More
Technologies. It is plain HTML/CSS with content in Markdown (`lessons/`) and printable
collateral. There is **no** package manager, backend, build step, test suite, or linter.

### Services

There is a single runnable "service": a static file server that serves the repo root.

- Run (dev): `python3 -m http.server 8000` from the repo root, then open
  `http://localhost:8000/index.html`. `python3` and `node` are already available in the VM.
- Build: none required — GitHub Pages serves the files as-is on push to the default branch.
- Test: none defined.
- Lint: none defined.

### Notes / gotchas

- Main marketing pages (`index.html`, `courses.html`, `partners.html`, `contact.html`,
  `get-started.html`) load **Tailwind CSS from a CDN** (`cdn.tailwindcss.com`), and some
  dark-theme pages pull **Google Fonts**. Full visual fidelity requires outbound network
  access; without it pages still render but are unstyled.
- Contact/signup forms post to a **Formspree placeholder** (`https://formspree.io/f/placeholder`),
  so actual form submission will not succeed until real Formspree IDs are configured. Typing
  into the fields works locally; only the POST is a no-op.
- Course enrollment links out to the external LMS at `learnmoretechnologies.com`; that flow
  lives outside this repo.
