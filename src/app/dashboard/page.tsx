"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Habit } from "@/types/habit";
import type { Session } from "@/types/auth";
import HabitCard from "@/components/habits/HabitCard";
import HabitForm from "@/components/habits/HabitForm";
import {
    getSession,
    clearSession,
    getHabitsByUser,
    createHabit,
    updateHabit,
} from "@/lib/storage";

function getTodayStr(): string {
    return new Date().toISOString().split("T")[0];
}

export default function DashboardPage() {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const today = getTodayStr();

    useEffect(() => {
        const s = getSession();
        if (!s) {
            router.replace("/login");
            return;
        }
        setSession(s);
        setHabits(getHabitsByUser(s.userId));
        setHydrated(true);
    }, [router]);

    function handleLogout() {
        clearSession();
        router.push("/login");
    }

    function handleCreateSave(name: string, description: string) {
        if (!session) return;
        const habit = createHabit(session.userId, name, description);
        setHabits((prev) => [...prev, habit]);
        setShowForm(false);
    }

    function handleEditSave(name: string, description: string) {
        if (!editingHabit) return;
        const updated: Habit = {
            ...editingHabit,
            name,
            description,
        };
        updateHabit(updated);
        setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
        setEditingHabit(null);
    }

    function handleUpdated(updated: Habit) {
        setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
    }

    function handleDeleted(habitId: string) {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
    }

    if (!hydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-400 text-sm">Loading…</div>
            </div>
        );
    }

    return (
        <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-indigo-600">Habit Tracker</h1>
                        {session && (
                            <p className="text-xs text-gray-400">{session.email}</p>
                        )}
                    </div>
                    <button
                        data-testid="auth-logout-button"
                        onClick={handleLogout}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Log out
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-2xl mx-auto px-4 py-6">
                {/* Create / Edit form */}
                {(showForm || editingHabit) && (
                    <div className="mb-6">
                        <HabitForm
                            initial={editingHabit ?? undefined}
                            onSave={editingHabit ? handleEditSave : handleCreateSave}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingHabit(null);
                            }}
                        />
                    </div>
                )}

                {/* Habit list or empty state */}
                {habits.length === 0 && !showForm ? (
                    <div
                        data-testid="empty-state"
                        className="flex flex-col items-center justify-center text-center py-20"
                    >
                        <div className="text-5xl mb-4">📋</div>
                        <h2 className="text-xl font-semibold text-gray-700">No habits yet</h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Add your first habit to start building consistency.
                        </p>
                        <button
                            data-testid="create-habit-button"
                            onClick={() => setShowForm(true)}
                            className="mt-6 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            + Add habit
                        </button>
                    </div>
                ) : (
                    <div>
                        {!showForm && !editingHabit && (
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Today — {today}
                                </h2>
                                <button
                                    data-testid="create-habit-button"
                                    onClick={() => setShowForm(true)}
                                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    + Add habit
                                </button>
                            </div>
                        )}

                        <div className="space-y-3">
                            {habits.map((habit) => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    today={today}
                                    onEdit={(h) => {
                                        setShowForm(false);
                                        setEditingHabit(h);
                                    }}
                                    onDeleted={handleDeleted}
                                    onUpdated={handleUpdated}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
