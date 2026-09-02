# Restructure the three free lessons

Those three free lessons are the beginning. Do not touch the rest of the course until these three match the Digital Pioneer spine.

These HTML sheets are facilitator guides. Do **not** upload them as LMS lessons. Use this file as the checklist for WordPress / your LMS.

## What the three free lessons become

| Free lesson now | Turn it into | Learner leaves able to… |
|---|---|---|
| Lesson 1 | **Welcome** (short) | Sign in, pick one goal (family / health / job / work), start the pre-survey |
| Lesson 2 | **Talk to AI** | Ask one real question in **one** tool and get a useful answer |
| Lesson 3 | **Don’t get scammed** | Spot a fake / pressure tactic; passwords or 2FA |

That is Modules 0–2. That is the public free funnel.

## How to restructure (do not rebuild)

- If Lesson 1 is phones / tablets → shrink it to 10 minutes inside Welcome (“make the text bigger, open the browser”). It is not a whole free lesson anymore.
- If Lesson 2 is Zoom or email → move it to later (Week 3). Put **Talk to AI** in that slot.
- If Lesson 3 is already safety → keep it. Add AI fakes (fake voice, fake photo). Rename it **Don’t get scammed**.

## What “done” looks like

1. Three titles on the LMS match the table above.
2. Lesson 2 uses the Week 1 take-home: one tool, 5 steps, one prompt.
3. A “start free” button still lands on Lesson 1.
4. After Lesson 3, the next lesson is locked (or says “join a cohort / Week 3”).

## In WordPress / the LMS

1. Open the existing 50+TechBridge course (the one at `/courses/50techbridge`).
2. Rename only the first three lessons. Do not delete the old content yet.
3. Rebuild **only Lesson 2 (Talk to AI)** this week:
   - Spoken video: `SCRIPT-lesson-02-talk-to-ai.txt` (generate with `write-script-lesson-02.py`)
   - Why those lines: `week-01-talk-to-ai-research.html`
   - Starter prompt from `week-01-talk-to-ai.html`
   - Five steps from `week-01-take-home.html`
   - One tool only (ChatGPT default)
   - “Stay logged out” + voice/mic + no SSN/bank/passwords
   - “Stop if it’s medical or legal”
   - Take-home as a PDF handout (open the HTML in Chrome → Ctrl+P → Microsoft Print to PDF)
4. Add the five pre-survey questions to Welcome (`pre-post-survey.html`).
5. Keep facilitator pages off the LMS: session script, week guides, `pilot-offer.html`, `outcomes-report.html`.

## After the three free lessons (not this week)

Rename locked modules to:

4. Stay connected  
5. Health & independence  
6. Money & work  
7. Your next chapter  

Drag old lessons under those names later. Phone help stays a short block inside Welcome, not its own module.

## Do not

- Paste a full HTML page into a WordPress lesson.
- Upload `print.css`.
- Start with Weeks 3–6, membership, or a new course.
- Create a second course. Same course, new first three titles.

## Facilitator files to use

| File | Use |
|---|---|
| `00-module-spine.html` | Official titles |
| `week-01-talk-to-ai.html` | How to teach Lesson 2 |
| `week-01-take-home.html` | Learner handout for Lesson 2 |
| `SCRIPT-lesson-02-talk-to-ai.txt` | HeyGen / Barb spoken script (2a / 2b / 2c) |
| `SCRIPT-lesson-02-talk-to-ai.html` | Printable script (Chrome → Print → Save as PDF) |
| `pdf/week-01-*.pdf` | Ready-to-print PDFs of Week 1 + research + script |
| `week-01-talk-to-ai-research.html` | Socials, comparisons, Pew/AARP references |
| `week-02-scams.html` | How to teach Lesson 3 |
| `pre-post-survey.html` | Welcome + Week 6 |

**This week’s win:** three new free-lesson titles + one live Talk to AI lesson + take-home PDF.
