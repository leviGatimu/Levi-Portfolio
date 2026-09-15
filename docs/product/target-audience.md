# Target Audience

The site has a small number of visitor types with different needs. The design must serve the first two exceptionally and the rest adequately.

## 1. Technical reviewer (primary)

*Recruiter with an engineering background, hiring manager, senior developer, hackathon or competition judge, scholarship/programme reviewer.*

- **Arrives from:** LinkedIn, the GitHub profile README, a direct link in an application.
- **Time budget:** 30–90 seconds on first pass; 5–10 minutes if interested.
- **Needs:** Is this real? What did he build, and what was *his* part? Can I see code? How deep does it go?
- **Design consequences:**
  - Featured work visible immediately; real screenshots, not device mockups.
  - Every project states role and team honestly ("solo", "with two classmates", "built for a client").
  - Repo links prominent where public; where a repo is private, say so rather than hide it.
  - Case studies include architecture and decisions, not marketing copy.
  - The About page answers "what year, which school, what next" in one screen.

## 2. Aviation / programme reviewer (secondary)

*Flight school, cadet programme, or aviation scholarship reviewer who looks at the personal site.*

- **Needs:** Evidence of discipline, systems thinking, follow-through, and genuine aviation interest.
- **Design consequences:**
  - Aviation appears as an authentic through-line (an About section, one line of opening metadata), never as a theme costume.
  - Simulation, embedded, and control projects (Rwasim, Planetary Scout) are framed in systems language.
  - The site itself is evidence: precise, calm, well-organised.

## 3. Peer / collaborator

*Classmates, other student developers, hackathon teammates, open-source contributors.*

- **Needs:** What is he working on now? How do I reach him? Can I use or contribute to something?
- **Design consequences:** "Now" note on About; GitHub and email one click away; project status visible (Active / Paused / Archived).

## 4. Client / small organisation (occasional)

*Someone considering him for a small website or app — as with Zibrah Code or SoW!se Africa.*

- **Needs:** Can he deliver a finished, polished product? Can I contact him?
- **Design consequences:** Client work (where permission is granted) marked as such; the polish of the portfolio itself is the pitch.

## 5. Levi (the maintainer)

- **Needs:** Add a project at midnight without friction. Never break the site from the admin.
- **Design consequences:** See [admin/cms-overview.md](../admin/cms-overview.md). Drafts by default; preview before publish; validation that says what is missing.

## Device and context assumptions

- Assume the majority of *first* visits are on mobile (link taps from LinkedIn, WhatsApp, email). Mobile is designed, not shrunk.
- Reviewers who get serious open a desktop browser with a large viewport. Wide screens (≥1440px) must feel composed, not stretched.
- Assume slow or metered connections for part of the audience. Image weight budgets matter — see [performance.md](../architecture/performance.md).
