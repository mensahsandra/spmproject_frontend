// Prefer Vite env if provided, else fallback to our direct backend
// Define VITE_API_URL in .env.local if you want to override in dev.
const envUrl = (import.meta as any)?.env?.VITE_API_URL as string | undefined;

// Use 127.0.0.1 instead of localhost to avoid potential DNS resolution issues
const endPoint = envUrl && envUrl.trim().length > 0 ? envUrl : "http://127.0.0.1:3000";

console.log("API endpoint:", endPoint);

export default endPoint;