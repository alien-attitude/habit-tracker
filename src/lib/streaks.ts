/**
 * Calculates the current consecutive streak from an array of completion dates.
 *
 * Rules:
 * - completions are YYYY-MM-DD strings
 * - duplicates are removed before calculation
 * - dates are sorted before logic
 * - if today is not completed, streak is 0
 * - if today is completed, count consecutive calendar days backwards
 */
export function calculateCurrentStreak(
    completions: string[],
    today?: string
): number {
    const todayStr = today ?? new Date().toISOString().split("T")[0];

    // Deduplicate
    const unique = Array.from(new Set(completions));

    // Sort ascending
    unique.sort();

    // If today is not completed, streak is 0
    if (!unique.includes(todayStr)) {
        return 0;
    }

    // Count consecutive days backwards from today
    let streak = 0;
    const current = new Date(todayStr + "T00:00:00Z");

    while (true) {
        const dateStr = current.toISOString().split("T")[0];
        if (!unique.includes(dateStr)) break;
        streak++;
        current.setUTCDate(current.getUTCDate() - 1);
    }

    return streak;
}
