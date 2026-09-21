# Roadmap.md — Nihongo Learning Platform

**Stack**: Next.js (App Router) + React, Tailwind CSS, Framer Motion, a database (Postgres via free-tier host, e.g. Supabase/Neon) for content only, Prisma or Drizzle as ORM, deployed on Vercel. **No authentication/accounts** — all pages and quizzes are open to any visitor.

---

## Phase 0 — Setup & Foundations
- [ ] Initialize Next.js app (App Router, TypeScript, Tailwind)
- [ ] Set up repo structure, linting, formatting (ESLint + Prettier)
- [ ] Set up database (Postgres, free tier) + ORM (Prisma/Drizzle) — for content storage only, no user tables
- [ ] Deploy a "hello world" to Vercel to confirm pipeline works end-to-end

## Phase 1 — Data Model & Content Structure
- [ ] Define schema: `Level`, `Category`, `LearningModule`, `Quiz`, `Question`, `QuestionType` (no `User` or `UserProgress` tables — nothing tied to an identity)
- [ ] Seed initial content: 1 level (e.g. N5), 2–3 categories (Hiragana, Vocabulary, Grammar basics), a few modules each
- [ ] Build content-authoring seed scripts (JSON → DB) so adding content later doesn't require code changes

## Phase 2 — Core Learning Flow (Read-Only)
- [ ] Home/Dashboard page (static shell first)
- [ ] Level overview page → lists categories
- [ ] Category page → lists learning modules
- [ ] Learning module page → renders lesson content
- [ ] Basic navigation between all of the above — fully open, no gating

## Phase 3 — Quiz Engine
- [ ] Design the pluggable question-type system (renderer + checker per type)
- [ ] Implement Multiple Choice type
- [ ] Implement Identify type (e.g., select correct kana/kanji from options)
- [ ] Implement Fill-in-the-blank type
- [ ] Implement Matching type
- [ ] Quiz runner: sequential question flow, progress indicator, scoring — answerable instantly by anyone, no login prompt
- [ ] Results screen: score summary, review of missed questions

## Phase 4 — Local Progress (No Accounts)
- [ ] Store completed modules + last quiz scores in the browser (localStorage), scoped per device
- [ ] Dashboard reflects local progress (not server/account-based)
- [ ] Optional: a "reset my progress" control since there's no account to fall back on
- [ ] (Optional) Level/category "recommended next" hints based on local progress — not hard-locked, since there's no account to enforce it against

## Phase 5 — Polish & Design Pass
- [ ] Apply full visual design system (per design.md): white + red palette, layout per the reference site
- [ ] Add Framer Motion transitions (page transitions, quiz card flips, progress bar animation)
- [ ] Responsive pass (mobile-first check across all screens)
- [ ] Accessibility pass (keyboard nav for quiz, proper contrast, ARIA labels)

## Phase 6 — Testing & Launch Prep
- [ ] Manual QA across full learner flow (visit → learn → quiz → see local progress)
- [ ] Basic automated tests for quiz scoring logic (critical path — must be correct)
- [ ] Performance check (Lighthouse pass on key pages)
- [ ] Set up analytics (free tier — e.g. Vercel Analytics or Plausible)
- [ ] Launch v1 (soft launch — share with a small group first)

## Phase 7 — Post-Launch / v2 Ideas (Not in v1 Scope)
- [ ] Lightweight content-management workflow for adding new lessons/quizzes faster (still not a public-facing admin login)
- [ ] Audio-based questions (listening comprehension)
- [ ] Streaks, badges, gamification layer (would need to be local-progress-based to stay account-free)
- [ ] Community/leaderboard features (would require rethinking the no-accounts approach if pursued)
- [ ] AI-assisted features (auto-generated quiz questions, mistake explanations)
- [ ] Native mobile app

---

## Suggested Build Order Priority
If time-constrained, prioritize **Phase 0 → 1 → 2 → 3** first — that's a fully working, fully open learn-and-quiz loop. Phase 4 (local progress) and Phase 5 (polish) can follow once the core loop feels good.