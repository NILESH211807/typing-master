"use client";
import StatsPanel from "@/components/StatsPanel";
import TextDisplay from "@/components/TextDisplay";
import { useState } from "react";

export default function Home() {

    const [hideStats, setHideStats] = useState<boolean>(false);
    const [rerenderKey, setRerenderKey] = useState<number>(0);

    return (
        <div className="mx-auto">
            <StatsPanel setRerenderKey={setRerenderKey} hideStats={hideStats} />
            <TextDisplay key={rerenderKey} setHideStats={setHideStats} />
        </div>
    );
}
