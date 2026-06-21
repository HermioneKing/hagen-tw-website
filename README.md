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
| `pnpm content:export` | Export CMS content to `content/` (also via Docker, see below) |
| `pnpm content:import` | Import CMS content from `content/` into the database |

## Content sync (dev → production)

CMS text and uploaded media are stored in PostgreSQL and on disk, not in application code. The `content/` folder holds a git-tracked snapshot that production imports on every deploy.

```
content/
  data/           # JSON exports (products, globals, media metadata)
  media/          # uploaded image files
```

**Dev is the source of truth.** Edit content at `/admin`, export, commit, push. Production imports on deploy and overwrites CMS content (contact form submissions and admin users are not exported).

### After editing content locally

```bash
# Export DB content + media metadata to content/
docker compose run --rm content-import npm run content:export

git add content/
git commit -m "Update site content"
git push
```

Uploads go directly to `content/media/` (bind-mounted into the app container).

### Deploy to VPS

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

The `content-import` service runs automatically before the app starts and applies the latest `content/` from git.

### First-time / migration

If you have files in the legacy `./media/` folder:

```bash
mkdir -p content/media
cp media/* content/media/
docker compose run --rm content-import npm run content:export
```

If `content/data/media.json` does not exist yet (fresh clone), import is skipped and the default seed runs instead.

## Project structure

- `src/app/(frontend)/[locale]/` — public pages
- `src/app/(payload)/admin/` — Payload admin UI
- `src/collections/` — Products, Media, Users, Contact Submissions
- `src/globals/` — Site settings, About, Contact content
- `public/hagen-icon.png` — logo / favicon
