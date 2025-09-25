# Student Performance Matrix — Backend (API)

Express + Mongoose API for attendance, grades, CWA, deadlines.

## Endpoints
- GET /api/health — service + DB status
- POST /api/attendance/check-in — student attendance
- POST /api/attendance/generate-session — lecturer QR session
- GET /api/attendance/logs — lecturer logs
- GET /api/attendance/export — CSV export

Auth: Bearer JWT required for protected routes via `Authorization: Bearer <token>`.

## Required environment variables
Set these in Vercel (Project → Settings → Environment Variables):
- MONGO_URI — MongoDB connection string
- JWT_SECRET — secret for JWT signing/verification

Optional: `PORT` (not used on Vercel serverless).

## Deploy on Vercel (Root Directory = backend)
1) Push this `backend/` folder to your GitHub repo (this project already includes serverless adapter):
   - `api/index.js` wraps Express app for serverless
   - `vercel.json` routes all traffic to the serverless entry
2) In Vercel → Import Project → Select GitHub repo
   - Root Directory: `backend`
   - Framework Preset: `Other`
   - Install Command: `npm ci`
   - Build Command: leave empty
   - Output Directory: leave empty
3) Add environment variables (`MONGO_URI`, `JWT_SECRET`).
4) Deploy.

## Local dev
- npm install
- npm run dev (or `node index.js`)
- Health: http://localhost:3000/api/health

## Payloads
Check-in (student):
```
POST /api/attendance/check-in
Authorization: Bearer <token>
Content-Type: application/json
{
  "studentId": "12345678",
  "qrCode": "{\"sessionCode\":\"ABC-XYZ\",\"courseCode\":\"BIT364\"}",
  "centre": "Kumasi",
  "timestamp": "2025-09-24T10:00:00.000Z",
  "location": "Room 101",
  "sessionCode": "ABC-XYZ" // optional fallback if QR not provided
}
```

## Notes
- CORS is configured to allow common localhost dev origins and won’t block preflight.
- If DB is unavailable, API will run with in-memory fallbacks for attendance sessions/logs.# spm-backend