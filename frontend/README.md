# ExpertEase Frontend

Vite + React (JSX) web app connected to the Python Flask backend.

## Run

1. **Start the backend** (from project root):
   ```
   python app.py
   ```
   Backend runs on http://localhost:5000

2. **Start the frontend**:
   ```
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on http://localhost:5173

## API Connection

- In dev, Vite proxies `/api` requests to `http://localhost:5000`
- All API calls go through `src/api/api.js`
- Auth token is stored in localStorage and sent via `Authorization: Bearer <token>`

## Tech Stack

- **Vite** + **React** (JSX, no TypeScript)
- **React Router** for routing
- **Fetch API** for backend calls
