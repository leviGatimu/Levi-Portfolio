# Content Strategy

## Voice

The site speaks in Levi's first person, plainly. The voice of a builder describing what he built — not a brand describing a product.

| Do | Don't |
|----|-------|
| "I built a Windows activity tracker that never sends data anywhere." | "Passionate about crafting seamless digital experiences." |
| "Solo. Around four months, alongside Year 2 coursework." | "Led a cross-functional team to deliver…" |
| "The tracker is the only process that writes to the database, so two screens can't disagree." | "Leveraged cutting-edge architecture." |
| "Paused — the desktop build works; the sync layer doesn't." | "Coming soon!" |
| Specific nouns: SQLite, named pipe, A* routing, FastAPI | Buzzwords: scalable, robust, seamless, cutting-edge, next-gen |

Rules:

1. **Short sentences.** Cut adjectives. Prefer the concrete noun.
2. **State scope honestly.** Year 2 student, solo or with named collaborators, coursework vs personal vs client. Honesty is the credibility strategy.
3. **Numbers only when real and sourced.** Commit counts, lines of code, "N users" — only if verifiable and meaningful. No round-number brags.
4. **Aviation is a sentence, not a theme.** It appears in the opening metadata and the About page. It never appears as cockpit UI, plane icons, or runway metaphors.
5. **No emoji as UI.** No emoji in headings, labels, or navigation.
6. **Capitalisation:** Sentence case for headings and body. ALL CAPS is reserved for the mono metadata style (labels, indices, section markers) — see [typography.md](../design/typography.md).
7. **No placeholder copy ships.** Lorem ipsum or "TODO" in the database blocks publishing (enforced in the admin).

## Opening statement (homepage)

The one line under the name that tells the visitor what Levi does. Candidates — **decision required from Levi** (see TODO):

| # | Statement | Notes |
|---|-----------|-------|
| A | **I build software, AI systems and robots — and finish them.** | Direct. "Finish them" is the differentiator for a student. |
| B | **Software, AI systems and robotics. Built, not listed.** | Echoes the proof-of-work principle. Slightly clever. |
| C | **Student developer building full-stack software, AI systems and robotics in Kigali.** | Safest, most searchable. Least memorable. |

Recommendation: **A**. It is a claim the projects then prove.

Not allowed: "Turning ideas into digital experiences", "Crafting beautiful web experiences", "Code is my passion", or any variant.

## Metadata line (under the name)

Mono, uppercase, tracked:

```
STUDENT DEVELOPER · NGA CODING ACADEMY, YEAR 2 · KIGALI, RWANDA
```

A second, quieter line may carry the aviation note:

```
FULL-STACK · AI · ROBOTICS · FUTURE COMMERCIAL PILOT
```

`FUTURE COMMERCIAL PILOT` — **NEEDS USER CONFIRMATION** on exact wording (e.g. "ASPIRING COMMERCIAL PILOT", "AVIATION-BOUND").

## Content per page (what must exist)

| Page | Required content | Source |
|------|------------------|--------|
| `/` | Name, metadata line, opening statement, portrait, 3–5 featured projects (cover image, name, one-liner, stack, year, status), work index, experiments strip, short bio (≤ 80 words), "now" line, email, social links | `site_settings` + `projects` |
| `/work` | All published projects with cover, name, one-liner, type, year, stack | `projects` |
| `/work/[slug]` | See [project-content-model.md](../content/project-content-model.md) | `projects` |
| `/about` | Long bio (200–400 words), education, leadership, aviation paragraph, skills grouped with honesty levels, "now" line, portrait (alternate crop) | `site_settings` (markdown fields) + `technologies` |
| Footer (all pages) | Email, GitHub, LinkedIn, © year, "last updated" | `site_settings` + max(`projects.updated_at`) |

## Project one-liners

The single sentence under each project name on the homepage and `/work`. Rules:

- Max ~90 characters.
- Says what it *is* and for whom, in plain words.
- No adjectives about quality ("powerful", "modern", "beautiful").

Verified drafts (from the projects' own READMEs; confirm with Levi):

| Project | One-liner draft |
|---------|-----------------|
| Study Flow | A study workstation that plans your day, times your focus, and scores the term honestly. |
| Trace | A private, local activity history for Windows. Nothing leaves your machine. |
| Rwasim | An agent-based traffic simulation of Kigali built on real OpenStreetMap data. |
| Wixy | Bite-sized communication lessons with AI practice conversations and transcript-grounded feedback. |
| Planetary Scout | A semi-autonomous rover prototype for sample collection — Raspberry Pi, OpenCV, ROS. |

## Skills presentation

No skill cloud, no percentage bars, no logo wall. On About only, as a compact typographic list grouped by area, each entry carrying an honest level (Strong / Comfortable / Learning / Experimental). Source: `technologies` table with `proficiency`. The homepage never lists skills — the projects do that job.

## Image content rules

- Project images are **real screenshots or real photos** of the work. No stock, no generic device mockups.
- Every image has meaningful alt text written by Levi in the admin (required field).
- Screenshots should be captured at 2× on a clean window at a consistent viewport (1440×900 for desktop apps/web, native for phone). Document the capture checklist in the admin help text.

## Copy that must be verified before launch

Tracked in [content-status.md](../content/content-status.md).
