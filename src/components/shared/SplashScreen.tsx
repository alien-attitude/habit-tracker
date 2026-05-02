export default function SplashScreen() {
    return (
        <div
            data-testid="splash-screen"
            className="fixed inset-0 flex flex-col items-center justify-center bg-indigo-600"
        >
            <div className="text-center text-white">
                <div className="mb-4 text-6xl">✅</div>
                <h1 className="text-4xl font-bold tracking-tight">Habit Tracker</h1>
                <p className="mt-2 text-indigo-200 text-sm">Build better habits, one day at a time</p>
            </div>
        </div>
    );
}
