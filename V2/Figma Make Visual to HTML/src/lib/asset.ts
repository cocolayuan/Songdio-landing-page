/** Prefix public-folder paths with Vite `base` (required for GitHub Pages). */
export function asset(path: string): string {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${normalized}`;
}
