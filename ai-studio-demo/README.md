<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/bundled/heirloom_recipes

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local`. Vite only loads `.env.local`, so the
   example file on its own has no effect.
3. Set `GEMINI_API_KEY` in `.env.local` to your Gemini API key.
4. Leave `VITE_USE_EMULATORS=true` to run against the local Firebase emulators,
   which is what this branch is set up for. Start them from the repository root
   with `firebase emulators:start` before running the app. Setting it to `false`
   points the app at the real project named in `src/firebaseConfig.ts`, which
   needs credentials this branch does not carry.
5. Run the app:
   `npm run dev`
