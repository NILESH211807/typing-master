"use client";
import StatsPanel from "@/components/StatsPanel";
import TextDisplay from "@/components/TextDisplay";
import { useState } from "react";

export default function Home() {

    const [hideStats, setHideStats] = useState<boolean>(false);

    return (
        <div className="mx-auto">
            <StatsPanel hideStats={hideStats} />
            <TextDisplay setHideStats={setHideStats} />
        </div>
    );
}
