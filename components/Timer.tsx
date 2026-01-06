"use client";
import { useTyping } from "@/provider/TypingProvider";
import { getTime } from "@/utils/timer";
import React, { useEffect, useState } from "react";
import { RiTimerLine } from "react-icons/ri";
import { ResultDataType } from "./TextDisplay";

type TimerProps = {
    isTyping: boolean,
    duration: number,
    setShowResult: (value: boolean) => void,
    setResultData: React.Dispatch<React.SetStateAction<ResultDataType>>;
}

export default function Timer({
    isTyping,
    duration,
    setShowResult,
    setResultData }: TimerProps) {
    const [time, setTime] = useState(duration);
    const { initialSetting } = useTyping();

    useEffect(() => {
        if (!isTyping || initialSetting.mode !== "time") return;
        if (time === 0) {
            setResultData(prev => ({
                ...prev,
                endTime: Date.now(),
            }));
            setShowResult(true);
            return;
        };
        const interval = setInterval(() => {
            setTime((prev) => prev - 1);
        }, 1000)
        return () => clearTimeout(interval);
    }, [time, isTyping, initialSetting.mode, setShowResult, setResultData]);

    return (
        <div className="text-orange-400 text-3xl max-[650px]:text-[25px] select-none flex items-center gap-3">
            <RiTimerLine />
            {getTime(time)}
        </div>
    )
}