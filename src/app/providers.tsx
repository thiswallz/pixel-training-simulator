"use client";

import {GameProvider} from "@/app/providers/GameContext";

export function Providers({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <GameProvider>{children}</GameProvider>
    );
}
