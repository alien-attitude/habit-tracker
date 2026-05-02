/**
 * Converts a habit name to a URL-safe slug.
 * - lowercase
 * - trim leading/trailing spaces
 * - collapse repeated internal spaces into a single hyphen
 * - remove non-alphanumeric characters except hyphens
 */
export function getHabitSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-{2,}/g, "-")
        .replace(/^-|-$/g, "");
}
