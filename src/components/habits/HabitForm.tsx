"use client";

import { useState, FormEvent } from "react";
import type { Habit } from "@/types/habit";
import { validateHabitName } from "@/lib/validators";

interface HabitFormProps {
    initial?: Habit;
    onSave: (name: string, description: string) => void;
    onCancel: () => void;
}

export default function HabitForm({ initial, onSave, onCancel }: HabitFormProps) {
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [nameError, setNameError] = useState<string | null>(null);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const result = validateHabitName(name);
        if (!result.valid) {
            setNameError(result.error);
            return;
        }
        setNameError(null);
        onSave(result.value, description.trim());
    }

    return (
        <div
            data-testid="habit-form"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {initial ? "Edit Habit" : "New Habit"}
            </h2>

            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                    <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Habit name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="habit-name"
                        type="text"
                        data-testid="habit-name-input"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (nameError) setNameError(null);
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Drink Water"
                    />
                    {nameError && (
                        <p role="alert" className="mt-1 text-xs text-red-600">
                            {nameError}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        id="habit-description"
                        data-testid="habit-description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Why is this habit important?"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                    </label>
                    <select
                        id="habit-frequency"
                        data-testid="habit-frequency-select"
                        value="daily"
                        disabled
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    >
                        <option value="daily">Daily</option>
                    </select>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        data-testid="habit-save-button"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {initial ? "Save changes" : "Create habit"}
                    </button>
                </div>
            </form>
        </div>
    );
}
