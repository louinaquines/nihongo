# Agents.md — Nihongo Learning Platform

This document defines the "agents" (actors/roles) in the system — both human user roles and, if AI features are added later, AI agent responsibilities. It also doubles as a guide for how an AI coding assistant (e.g. Claude Code) should reason about this codebase.

**No account system of any kind (no learner login, no admin accounts).** All content is open and publicly accessible; anyone can browse and answer quizzes freely without signing up.

## Human Roles

### 1. Visitor / Learner (the only user role)
- Browses levels/categories freely, no login required
- Consumes learning modules (text, examples, audio if added later)
- Takes quizzes tied to each module without any account
- Any progress shown (e.g. completed modules, last quiz score) is local to their device/browser only — never tied to an identity or stored server-side per-user

### 2. Content Author (you, the site owner — not an in-app role)
- Levels, Categories, Learning Modules, and Quizzes are authored and shipped as data (seed files/JSON/CMS-lite), not managed through an in-app admin panel
- No in-app admin login or dashboard exists in v1 — content changes happen via the codebase/data source directly, not through the live site

## System Agents (Code-Level)

### Content Agent
Responsible for serving structured content: levels → categories → modules. Pure read logic, no state mutation, no auth checks — everything is public.

### Quiz Engine Agent
Responsible for:
- Rendering the correct UI per question type (`multiple_choice`, `identify`, `fill_blank`, `matching`)
- Validating answers against a type-specific checker function
- Scoring and returning results immediately client-side — no server round-trip needed to "unlock" or gate a quiz
- This should be a pluggable system — adding a new question type = adding a new checker + renderer, not touching existing ones.

### Local Progress Agent
Tracks learner state (completed modules, last quiz scores, current level) **in the browser only** (e.g. localStorage), scoped to that device. No server persistence, no user identity, no database table tied to an account. If the learner clears their browser data or switches devices, progress simply resets — that's an accepted tradeoff of the no-accounts approach.

### (Optional, later) AI Tutor Agent
If AI is added: could generate example sentences, explain grammar mistakes, or auto-generate quiz questions from a topic. Not in v1 scope — flagged here so the data model doesn't need rework later if added. Would still need to work without requiring an account.

## Guidance for AI Coding Assistants Working in This Repo
- **Do not add authentication, login, signup, or user/admin account models.** Every route/page is public by design.
- Question types are polymorphic — never hardcode `if type === 'multiple_choice'` logic scattered across files. Centralize in the Quiz Engine.
- Content (levels/categories/modules/quizzes) should be data-driven, not hardcoded in components — seed via JSON/DB so content is easy to update without touching component code.
- Any "progress" or "history" feature must be implemented with client-side storage (localStorage/sessionStorage) — never assume a logged-in user context exists.