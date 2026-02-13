"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Safely initialize convex, avoiding build errors if env var is missing during static generation
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

export default function ConvexClientProvider({
    children,
}: {
    children: ReactNode;
}) {
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
