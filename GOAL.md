# Goal.md — Nihongo Learning Platform

## Vision
A web-based Japanese (Nihongo) learning platform that teaches through structured levels and categories, pairing every learning module with an interactive quiz to reinforce retention.

## Core Objective
Help learners progress from absolute beginner to advanced Japanese through a clear, frictionless path: **Learn → Quiz → Level Up** — with zero signup required.

## Primary Goals
1. **Structured Learning Path** — Organize content by level (e.g., N5 → N1 or Beginner → Advanced) and category (Hiragana, Katakana, Kanji, Vocabulary, Grammar).
2. **Active Recall via Quizzes** — Every learning module ends in a quiz mixing question types (multiple choice, identify, fill-in-the-blank, matching) so learners aren't just passively reading.
3. **No Accounts, No Barriers** — Anyone can open the site and start learning/answering quizzes immediately. No login, no signup, no admin/user account system at all.
4. **Low Friction Learning** — Minimal, clean UI so the content is the focus, not the chrome.
5. **Scalable Content Model** — Adding a new level/category/lesson/quiz should be a content operation, not a code change.

## Non-Goals (for v1)
- User accounts / authentication of any kind (learner or admin)
- Server-persisted progress tracking tied to an identity — if progress is saved, it's local to the device/browser only (e.g., localStorage), never account-based
- Live tutoring / human conversation practice
- Speech recognition / pronunciation scoring
- Community features (forums, leaderboards) — possible v2
- Mobile app (native) — web-first, responsive

## Success Criteria
- A learner can go from zero knowledge of hiragana to passing an N5-level quiz using only the platform — with no signup step in the way.
- Quiz question types are reusable across all levels/categories without custom code per question.
- Site feels fast and modern — no jank, no clutter.

## Target Users
- Self-learners studying Japanese casually or for JLPT prep
- Students who want structured, bite-sized lessons instead of scattered YouTube videos/apps