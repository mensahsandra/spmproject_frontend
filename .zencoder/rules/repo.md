# Student Performance Metrix Frontend

## Stack Overview
- **Framework**: React with TypeScript
- **Bundler**: Vite
- **Styling**: Bootstrap classes with inline styles
- **Routing**: React Router DOM v6
- **State Management**: React hooks and Context-based utilities

## Key Scripts
1. `npm run dev` — Start the Vite development server
2. `npm run build` — Run TypeScript checks and create a production build
3. `npm run preview` — Preview the production build locally

## Project Structure Highlights
- **src/components/Dashboard/** — Core dashboard components (attendance, quizzes, grades)
- **src/pages/** — Top-level route components (results, dashboards, selects)
- **src/utils/** — API clients, helpers, and mock data

## Development Notes
- Ensure environment variables required by API helpers are configured in `.env` or Vercel project settings.
- TypeScript strictness is enabled; keep props and hooks fully typed.
- Backend endpoints are served from `https://spmproject-backend.vercel.app/`.

## Troubleshooting Builds
- Run `npm run build` locally before pushing to catch TypeScript errors.
- Check for unused imports or state hooks; Vercel treats TypeScript warnings as build blockers.
- Confirm API hooks (e.g., `fetchAttendanceData`) are invoked via callbacks that match the expected signature.

## Deployment
- Deployed via Vercel with automatic builds from the `main` branch.
- Keep `package-lock.json` committed for consistent dependency resolution.

---
## Testing Framework
targetFramework: Playwright

Generated automatically to assist future debugging sessions.