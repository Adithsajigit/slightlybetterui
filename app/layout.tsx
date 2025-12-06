import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Shore to Door - Wholesale Ordering",
  description: "B2B Wholesale Fish Ordering System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    ocean: {
                      50: '#f0f9ff',
                      100: '#e0f2fe',
                      500: '#0ea5e9',
                      600: '#0284c7',
                      800: '#075985',
                      900: '#0c4a6e',
                    },
                    silver: '#cbd5e1',
                    gold: '#fbbf24',
                    platinum: '#e2e8f0', // bluish grey
                    diamond: '#b9fbc0', // subtle greenish tint
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body className="bg-gray-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}