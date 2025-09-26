# Chatbot - Fixed ready-to-deploy bundle

This repo contains backend and frontend cleaned projects. I applied fixes to make the backend start-ready and prepared scripts for building and serving the frontend build.

## Backend (backend_cleaned)
- Run `npm install`
- Create `.env` based on `.env.example`
- Build: `npm run build`
- Start: `npm start`
- Dev: `npm run dev` (requires devDependencies)

Notes:
- The backend now uses `express.json()`, `cookie-parser`, and CORS handling.
- If the frontend `frontend_cleaned/build` exists, the backend will serve it (single-host deployment).

## Frontend (frontend_cleaned)
- Run `npm install`
- Create `.env` if you need to set `REACT_APP_API_BASE`
- Build: `npm run build`
- Deploy on Vercel/Netlify or serve the build via the backend (see above)

## To create a production bundle on your machine
1. cd backend_cleaned && npm install && npm run build
2. cd ../frontend_cleaned && npm install && npm run build
3. Copy `frontend_cleaned/build` into `backend_cleaned/frontend_cleaned/build` (the backend looks for the build folder there)
4. Start the backend: `cd backend_cleaned && npm start`

