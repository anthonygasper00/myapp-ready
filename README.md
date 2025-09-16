# Ready-to-deploy single-app (Express + static frontend)

## What this is
This package contains a simple Express server that serves a static frontend (in /public) and exposes one API endpoint:

- `POST /api/submit_idea` — accepts `{ idea: string }` and echoes it back as JSON.
- `GET /health` — returns status for health checks.

There is no build step required for this package. Render (or any Node host) will run `npm install` and `npm start`.

## Run locally (for quick testing)
1. Unzip the package and open a terminal in the folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open http://localhost:3000 in your browser.

## Deploy to Render (step-by-step)
1. Create a GitHub repository (e.g., `myapp-ready`) and upload **all files** from this package to the repo root. Be sure `package.json` is in the repo root.
2. Go to https://render.com and sign in with GitHub.
3. Click **New +** -> **Web Service**.
4. Select your repository (the one you just uploaded).
5. Fill in:
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
6. In Environment Variables add:
   - `OPENAI_API_KEY` = (your OpenAI API key) — optional for now.
7. Click **Create Web Service** and wait for the deployment to finish.
8. Visit the URL Render provides (e.g., https://your-repo.onrender.com) — that's your live app.

## Notes
- If you'd like me to add OpenAI integration (so the server calls the OpenAI API), I can provide exact code and you only need to add your `OPENAI_API_KEY` to Render's env vars.
- Every time you change code locally, push to GitHub and Render will auto-deploy the latest commit.
