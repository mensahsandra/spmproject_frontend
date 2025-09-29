// Simple endpoint configuration
// Force production backend URL for all Vercel deployments

// Force production backend for all deployments
const PRODUCTION_BACKEND = 'https://spmproject-backend.vercel.app';

function getEndpoint(): string {
	// Always use production backend for Vercel deployments
	if (typeof window !== 'undefined') {
		const host = window.location.host;
		console.log('[API] Current host:', host);
		
		if (host.includes('vercel.app')) {
			console.log('[API] Using production backend for Vercel deployment');
			return PRODUCTION_BACKEND;
		}
		
		if (host.includes('localhost') || host.includes('127.0.0.1')) {
			console.log('[API] Using local backend for development');
			return 'http://127.0.0.1:3000';
		}
	}
	
	// Default to production backend
	console.log('[API] Using production backend as default');
	return PRODUCTION_BACKEND;
}

// Create a getter function that always evaluates at runtime
export function getApiBase(): string {
	return getEndpoint();
}

// For compatibility, export a default that gets the endpoint
export default getEndpoint();