"use client";
import { getTime } from "@/utils/timer";
import { useEffect, useState } from "react";
import { RiTimerLine } from "react-icons/ri";

export default function Timer({ isTyping }: { isTyping: boolean }) {
    const [time, setTime] = useState(120);

    useEffect(() => {
        if (!isTyping) return;
        if (time === 0) return;
        const interval = setInterval(() => {
            setTime((prev) => prev - 1);
        }, 1000)
        return () => clearTimeout(interval);
    }, [time, isTyping]);

    return (
        <div className="text-orange-400 text-3xl max-[650px]:text-[25px] select-none flex items-center gap-3">
            <RiTimerLine />
            {getTime(time)}
        </div>
    )
}