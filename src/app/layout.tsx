import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Habit Tracker",
    description: "Build better habits, one day at a time",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    themeColor: "#6366f1",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#6366f1" />
            <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        </head>
        <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
        <script
            dangerouslySetInnerHTML={{
                __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('SW registration failed:', err);
                  });
                });
              }
            `,
            }}
        />
        </body>
        </html>
    );
}
