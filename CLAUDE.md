# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Two projects that deploy separately and share no code, modelled on `../HGS/`:

| Directory | What it is | Stack | Port |
|---|---|---|---|
| `homesprit-frontend/` | Public listing site + `/admin` dashboard | Next.js 16, React 19, TS strict, Tailwind 3, Redux-Saga | 3002 |
| `homesprit-backend/` | Listings, inquiries, staff auth | FastAPI, SQLModel, Alembic, PostgreSQL | 8001 |

Read `docs/ARCHITECTURE.md` first: it maps every convention to its HGS origin
and lists every deliberate deviation. Each project has its own CLAUDE.md.

Ports 8001/3002 because HGS takes 8000/3001 on the development machine.

## A change on one side usually needs the other

The contract is mirrored by hand; nothing generates or checks it.

| Backend change | Frontend counterpart |
|---|---|
| A Pydantic schema | `src/interface/<domain>.interface.ts` |
| Inquiry submit limits | `src/helpers/validation/inquiry.schema.ts` |
| A new enum value | `src/helpers/properties/labels.ts` (the type check fails until labelled) |
| A new router prefix in `src/api/v1/router.py` | `ALLOWED_PREFIXES` in `app/api/admin/[...path]` and/or `app/api/public/[...path]` |
| A new table | `OWNED_TABLES` in `alembic/env.py` and `discover_entities()`, same commit |
| `ENQUIRABLE_STATUSES` | `ENQUIRABLE` in `labels.ts` |

## Rules that hold across both

- The browser never talks to the backend. `HOMESPRIT_BACKEND_URL` is server-only.
- The session JWT lives in the httpOnly `homesprit_session` cookie. `proxy.ts`
  checks only `exp`; the backend verifies and re-reads the user every request.
- Roles are checked by `hasAccess(roles=...)`; ownership (agent ↔ listing) is
  checked in use cases. Never move ownership into the frontend.
- Public visibility lives only in `PropertyRepository`: search = live + LISTED
  (`available`, `under_offer`); detail page = live + VIEWABLE (also `sold`, `rented`).
- `null` from a reader means "could not read"; an empty list means "nothing".
  Never collapse them.
- Every delete is soft; slugs stay reserved.

## Local secrets

`homesprit-backend/.env` and `homesprit-frontend/.env.local` (gitignored).
`.dev-credentials.txt` in this directory holds the generated local demo
passwords and is gitignored too.
