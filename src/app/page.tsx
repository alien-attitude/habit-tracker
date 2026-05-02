"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import { getSession } from "@/lib/storage";

export default function RootPage() {
    const router = useRouter();
    const [visible] = useState(true);

    useEffect(() => {
        // Show splash for between 800ms and 2000ms as specified
        const delay = 1000;
        const timer = setTimeout(() => {
            const session = getSession();
            if (session) {
                router.push("/dashboard");
            } else {
                router.push("/login");
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [router]);

    if (!visible) return null;
    return <SplashScreen />;
}
