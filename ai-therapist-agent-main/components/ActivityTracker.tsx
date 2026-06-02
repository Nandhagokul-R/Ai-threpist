"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ActivityTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    // Use a ref to track if we've logged the current path to avoid strict mode double logging 
    // or simple re-renders. 
    const lastLoggedPath = useRef<string | null>(null);

    useEffect(() => {
        const logPageView = async () => {
            const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

            // Prevent duplicate logging for the same path in short succession
            if (lastLoggedPath.current === fullPath) return;
            lastLoggedPath.current = fullPath;

            const token = localStorage.getItem("token");
            if (!token) return; // Only log if authenticated

            try {
                await fetch("/api/activity", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        type: "page_view",
                        name: `Visited ${pathname}`,
                        description: `User visited ${fullPath}`,
                    }),
                });
            } catch (error) {
                console.error("Failed to log activity:", error);
            }
        };

        // Log the page view
        logPageView();

        // We could also set up a timer to log time spent, but let's stick to visits for now.
    }, [pathname, searchParams]);

    return null;
}
