# Deciduel - AI-Powered Decision Making

Make decisions with personality. Choose your vibe, let AI comment, pick your winner.

## Features

- 6 AI Personalities (Logical, Savage, Zen, Dramatic, Chaotic, Corporate)
- Each personality has unique visual themes and commentary styles
- Tournament bracket system
- Shareable results
- Creative alternatives for duplicate options

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your Groq API key (optional):
```
GROQ_API_KEY=your_key_here
```

3. Start the server:
```bash
npm start
```

4. Open http://localhost:4000

## Deploy to Vercel

### One-time Setup:

1. **Create GitHub account** (if you don't have one): https://github.com

2. **Install Git** (if not installed):
   - Download from: https://git-scm.com/downloads
   - Or use GitHub Desktop: https://desktop.github.com/

3. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it "deciduel" (or whatever you want)
   - Don't initialize with README (we already have files)
   - Click "Create repository"

4. **Push your code to GitHub:**

Open terminal in this folder and run:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Connect to GitHub (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/deciduel.git

# Push
git branch -M main
git push -u origin main
```

5. **Deploy to Vercel:**
   - Go to https://vercel.com/signup
   - Sign up with GitHub (easiest)
   - Click "New Project"
   - Import your repository
   - Add environment variable: `GROQ_API_KEY` = your Groq key
   - Click "Deploy"

6. **Done!** You'll get a URL like `deciduel.vercel.app`

### To Update After Changes:

```bash
git add .
git commit -m "Update features"
git push
```

Vercel auto-deploys on every push.

## Environment Variables

- `GROQ_API_KEY` - (Optional) Groq API key for AI commentary. Get one at https://console.groq.com
  - If not provided, app uses fallback commentary

## Tech Stack

- Frontend: Vanilla JavaScript (ES6 modules)
- Backend: Node.js + Express
- AI: Groq (Llama 3.1)
- Hosting: Vercel (recommended)

## License

MIT
