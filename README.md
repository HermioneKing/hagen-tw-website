# Hagen Creative Official Website

Bilingual (English + Traditional Chinese) company website with a Payload CMS admin dashboard for editing products and page content.

## Stack

- Next.js 15 + Payload CMS 3
- PostgreSQL 16
- Tailwind CSS v4 (design tokens from `DESIGN.md`)
- Docker Compose

## Quick start (Docker)

1. Copy environment file and set secrets:

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:

- `PAYLOAD_SECRET` — long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — first admin login (seeded on first boot)

2. Start services:

```bash
docker compose up --build
```

3. Open:

- Public site: http://localhost:3000/zh-TW (or `/en`)
- Admin: http://localhost:3000/admin

## Local development

1. Start Postgres only:

```bash
docker compose up db -d
```

2. Copy `.env.example` to `.env` and set:

```
DATABASE_URI=postgresql://hagen:hagen@localhost:5432/hagen
```

3. Install and run:

```bash
pnpm install
pnpm dev
```

## Admin

- Login at `/admin` with the credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- No public user registration — only the seeded admin can be created via env on first init
- Edit **Products**, **Site Settings**, **About Page**, **Contact Page** globals
- Contact form submissions appear in **Contact Submissions**

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm generate:types` | Regenerate Payload types |

## Project structure

- `src/app/(frontend)/[locale]/` — public pages
- `src/app/(payload)/admin/` — Payload admin UI
- `src/collections/` — Products, Media, Users, Contact Submissions
- `src/globals/` — Site settings, About, Contact content
- `public/hagen-icon.png` — logo / favicon
