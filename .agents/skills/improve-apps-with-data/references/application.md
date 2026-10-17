# Productivity OS: application improvement profile

Repository: `thermanjr-oss/fantastic-disco`.

## Scope and status

The owner requested this workflow across applications, with LITS prioritized for portfolio work. This branch adds agent guidance and measurement proposals. It does not implement event delivery, install an SDK, enable recording, run an experiment, deploy an application, or establish baseline results.

## Primary outcome proposal

Candidate activation: a new eligible user completes the first meaningful task within seven days / eligible new users with a mature window.

Baseline counts, event coverage, active environment, cohort definition, and experiment allocation are unverified until inspected for the specific task. Report missing evidence instead of inventing rates.

## Evidence and event contract

Define task-created/completed and exposure events without collecting task text or calendar details.

Start with these existing source locations:
- `app`
- `components`
- `lib`

Before adding events, define a versioned allowlist of event names, types, permitted coarse properties, source of truth, deduplication rule, and observation window. Use synthetic delivery tests. Do not add raw free text, URLs/query strings, or sensitive identifiers to analytics.

## App-specific constraints

Exclude task/calendar/subscription contents, user-supplied AI keys, auth data, push tokens, and private project details. Preserve notification consent and subscription behavior.

## Release and verification

Keep the existing deployment and database model; no schema pushes, reminder jobs, or new schedules are part of workflow adoption.

Follow the shared skill's experiment record and stopping plan. Review completed/abandoned journeys only where appropriate access and capture settings already permit it. Keep production collection and experiment rollout status explicit in every report.
