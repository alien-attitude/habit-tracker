"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { findUserByEmail, saveSession } from "@/lib/storage";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const user = findUserByEmail(email.trim());

        if (!user || user.password !== password) {
            setError("Invalid email or password");
            setLoading(false);
            return;
        }

        saveSession({ userId: user.id, email: user.email });
        router.push("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome back</h1>

                {error && (
                    <div
                        role="alert"
                        className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            data-testid="auth-login-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            data-testid="auth-login-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        data-testid="auth-login-submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    No account?{" "}
                    <Link href="/signup" className="text-indigo-600 hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
