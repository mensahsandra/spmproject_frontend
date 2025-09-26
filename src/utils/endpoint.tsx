// Derive API base URL following priority:
// 1. Explicit VITE_API_URL env
// 2. If running on a production host (e.g. vercel.app) and no env var, assume deployed backend domain
// 3. Fallback to local dev server

const envUrl = (import.meta as any)?.env?.VITE_API_URL as string | undefined;

function inferProdApi(): string | undefined {
	if (typeof window === 'undefined') return undefined;
	const host = window.location.host;
	// If frontend deployed to vercel and no env configured, infer backend subdomain
	if (/vercel\.app$/i.test(host)) {
		// Hardcode known backend domain for now
		return 'https://spmproject-backend.vercel.app';
	}
	return undefined;
}

const derived = envUrl?.trim() || inferProdApi() || 'http://127.0.0.1:3000';

// Normalize: remove trailing slashes
const endPoint = derived.replace(/\/$/, '');

if (typeof window !== 'undefined') {
	console.log('[API] Base endpoint selected:', endPoint);
}

export function getApiBase() { return endPoint; }
export default endPoint;