**NoteApp Deployment Guide**

This guide explains how to deploy the React client (Vite) to Vercel and the Django server to Render/Heroku/ Railway.

**Prerequisites**
- Git repository with client/ and server/ folders
- For server: a production database (Postgres recommended) and environment variables

**Server (Django) — Prepare and deploy**

1. Environment variables (set in hosting platform):
   - `DJANGO_SECRET_KEY` — strong secret
   - `DJANGO_DEBUG` — `False`
   - `DJANGO_ALLOWED_HOSTS` — comma-separated hostnames (e.g. `yourdomain.com`)
   - `DATABASE_URL` — (optional) e.g., `postgres://user:pass@host:5432/dbname`
   - `CORS_ALLOWED_ORIGINS` — frontend origin (e.g. `https://your-frontend.vercel.app`)
   - `CSRF_TRUSTED_ORIGINS` — same as frontend origin

2. Install requirements and migrate (example shell):

postgresql://steve:GotV3on6Df0w8pY0ljBM5L5g3X17SkjF@dpg-d93f2rvaqgkc73brm3d0-a/noteapp_db_3qs1

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

3. Start server (example using gunicorn):

```bash
gunicorn config.wsgi --bind 0.0.0.0:$PORT
```

4. Hosting options:
- Heroku: push code, set Buildpack to python, set config vars as above, Procfile is provided (`web: gunicorn config.wsgi --log-file -`).
- Render: Create a Web Service, build command `pip install -r requirements.txt`, start command `gunicorn config.wsgi`.
- Railway: Similar to Render; configure environment variables accordingly.

**Client (React/Vite) — Prepare and deploy to Vercel**

1. Set environment variable in Vercel project settings:
   - `VITE_API_BASE_URL` — URL of your deployed Django API (e.g. `https://your-backend.onrender.com`)

2. Build & deploy:
- Vercel detects the repository. In the project settings set root to `/client` (if monorepo) or configure project to point to `client` directory.
- Build command: `npm run build`
- Output directory: `dist`

3. Locally, you can build and preview:

```bash
cd client
npm install
npm run build
npm run preview
```

**CORS / CSRF**
- Ensure `CORS_ALLOWED_ORIGINS` (or `CORS_ALLOW_ALL_ORIGINS=True` only for testing) allows your client origin.
- Set `CSRF_TRUSTED_ORIGINS` to your client origin for secure CSRF handling.

**Verification (end-to-end)**
1. Deploy server and note the API base URL.
2. Set `VITE_API_BASE_URL` in Vercel to that URL and redeploy client.
3. Visit your Vercel URL and confirm the app can fetch API endpoints (e.g., login/register, notes list).

**Useful commands**
- Run migrations: `python manage.py migrate`
- Create superuser: `python manage.py createsuperuser`
- Collect static files: `python manage.py collectstatic --noinput`

**Notes**
- `server/.env.example` and `client/.env.production` were added as templates.
- The Django `settings.py` now reads production config from environment variables and uses WhiteNoise for static asset serving.
- The React client reads `VITE_API_BASE_URL` (Vite env var) at build time; set this in Vercel.

If you want, I can also:
- Add a `vercel.json` with project settings, or
- Create a Render/Heroku deployment script.
