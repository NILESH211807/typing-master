import { ResultDataType } from "@/components/TextDisplay";

export function calculateResult(data: ResultDataType) {
    const {
        startTime,
        endTime,
        typedChars,
        correctChars,
        incorrectChars,
        totalKeystrokes,
        backspaces,
        words,
    } = data;

    const timeInSeconds = (endTime - startTime) / 1000;
    const timeInMinutes = timeInSeconds / 60 || 1 / 60;

    const wpm = Math.round((correctChars / 5) / timeInMinutes);

    const accuracy =
        typedChars === 0 ?
            100 : (correctChars / typedChars) * 100;

    const cpm = correctChars / timeInMinutes;
    const kpm = totalKeystrokes / timeInMinutes;

    return {
        wpm: Math.round(wpm),
        accuracy: Number(accuracy.toFixed(2)),
        cpm: Math.round(cpm),
        kpm: Math.round(kpm),
        backspaces,
        words,
        correctChars,
        incorrectChars,
        timeSeconds: Math.round(timeInSeconds),
    };
}