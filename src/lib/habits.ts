import type { Habit } from "@/types/habit";

/**
 * Toggles a date in habit.completions.
 * - adds date if not present
 * - removes date if already present
 * - no duplicates
 * - does not mutate the original habit
 */
export function toggleHabitCompletion(habit: Habit, date: string): Habit {
    const existingSet = new Set(habit.completions);

    if (existingSet.has(date)) {
        existingSet.delete(date);
    } else {
        existingSet.add(date);
    }

    return {
        ...habit,
        completions: Array.from(existingSet),
    };
}
