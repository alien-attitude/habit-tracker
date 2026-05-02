"use client";

import { useState } from "react";
import type { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { toggleHabitCompletion } from "@/lib/habits";
import { updateHabit, deleteHabit } from "@/lib/storage";

interface HabitCardProps {
    habit: Habit;
    today: string;
    onEdit: (habit: Habit) => void;
    onDeleted: (habitId: string) => void;
    onUpdated: (habit: Habit) => void;
}

export default function HabitCard({
                                      habit,
                                      today,
                                      onEdit,
                                      onDeleted,
                                      onUpdated,
                                  }: HabitCardProps) {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const slug = getHabitSlug(habit.name);
    const streak = calculateCurrentStreak(habit.completions, today);
    const isCompleted = habit.completions.includes(today);

    function handleToggle() {
        const updated = toggleHabitCompletion(habit, today);
        updateHabit(updated);
        onUpdated(updated);
    }

    function handleDelete() {
        deleteHabit(habit.id);
        onDeleted(habit.id);
    }

    return (
        <>
            <div
                data-testid={`habit-card-${slug}`}
                className={`rounded-xl border p-4 transition-colors ${
                    isCompleted
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-white"
                }`}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3
                            className={`font-semibold truncate ${
                                isCompleted ? "text-green-800 line-through" : "text-gray-800"
                            }`}
                        >
                            {habit.name}
                        </h3>
                        {habit.description && (
                            <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">
                                {habit.description}
                            </p>
                        )}
                        <div
                            data-testid={`habit-streak-${slug}`}
                            className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                            aria-label={`${streak} day streak`}
                        >
                            🔥 {streak} day{streak !== 1 ? "s" : ""} streak
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                            data-testid={`habit-complete-${slug}`}
                            onClick={handleToggle}
                            aria-pressed={isCompleted}
                            aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
                            className={`rounded-full w-9 h-9 flex items-center justify-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                                isCompleted
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-gray-100 text-gray-400 hover:bg-indigo-100 hover:text-indigo-600"
                            }`}
                        >
                            {isCompleted ? "✓" : "○"}
                        </button>

                        <div className="flex gap-1">
                            <button
                                data-testid={`habit-edit-${slug}`}
                                onClick={() => onEdit(habit)}
                                aria-label={`Edit ${habit.name}`}
                                className="rounded-lg p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                ✏️
                            </button>
                            <button
                                data-testid={`habit-delete-${slug}`}
                                onClick={() => setShowConfirmDelete(true)}
                                aria-label={`Delete ${habit.name}`}
                                className="rounded-lg p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showConfirmDelete && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-dialog-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                >
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <h2 id="delete-dialog-title" className="text-lg font-bold text-gray-900">
                            Delete habit?
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to delete <strong>{habit.name}</strong>? This cannot be undone.
                        </p>
                        <div className="mt-4 flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                data-testid="confirm-delete-button"
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
