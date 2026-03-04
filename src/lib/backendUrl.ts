/**
 * Small helper that returns the backend base URL from env
 */
export const getBackendUrl = () => (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");

export default getBackendUrl;
