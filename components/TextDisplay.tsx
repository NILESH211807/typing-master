"use client";
import React, { Activity, useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import Timer from "./Timer";
import { generateWords, getCursorLineIndex, getLineCount } from "@/utils/generate";
import { removeFirstLine } from "@/helper/removeWordsLine";
import { addOneLineOfWords } from "@/helper/addWords";
import Loader from "./Loader";
import { LuCircleDot } from "react-icons/lu";
import { useTyping } from "@/provider/TypingProvider";
import ResultModal from "./ResultModal";
import { initTypingSound, playTypingSound } from "@/utils/sound";
import debounce from "@/utils/dbounce";

export type ResultDataType = {
    startTime: number,
    endTime: number,
    totalKeystrokes: number,
    typedChars: number,
    correctChars: number,
    incorrectChars: number,
    backspaces: number,
    words: {
        correct: number,
    }
}

export default function TextDisplay({ setHideStats }: { setHideStats: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [words, setWords] = useState<string[]>(() => generateWords(30));
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
    const [activeCharIndex, setActiveCharIndex] = useState<number>(0);
    const [wordCount, setWordCount] = useState<number>(0);
    const [inputChar, setInputChar] = useState<string>("");
    const cursorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isIncorrect, setIsIncorrect] = useState(false);
    const incorrectRef = useRef<HTMLDivElement>(null);
    const [wrongKeyCount, setWrongKeyCount] = useState(0);
    const lineLockRef = useRef(false);
    const [loading, setLoading] = useState(true);
    const { initialSetting, defaultResult } = useTyping();
    const [resultData, setResultData] = useState<ResultDataType>(defaultResult);
    const [showResult, setShowResult] = useState(false);

    const [timerResetKey, setTimerResetKey] = useState(0);

    // reset
    const reset = (type = "next") => {
        if (type === "next") {
            setWords(generateWords(30));
        }
        setActiveWordIndex(0);
        setActiveCharIndex(0);
        setIsTyping(false);
        setInputChar("");
        setIsIncorrect(false);
        setWrongKeyCount(0);
        setResultData(defaultResult);
        setTimerResetKey(prev => prev + 1);
        setWordCount(0);
        setShowResult(false);
    }

    useEffect(() => {

        if (initialSetting.mode === "words") {
            if (wordCount === initialSetting.wordCount) {
                setResultData(prev => ({
                    ...prev,
                    endTime: Date.now(),
                }))
                setShowResult(true);
            }
        }

    }, [activeWordIndex, initialSetting.wordCount, initialSetting.mode, wordCount])

    const checkIsTypingRef = useRef(
        debounce(() => {
            setHideStats(false);
        }, 5000)
    );

    useEffect(() => {
        return () => {
            checkIsTypingRef.current.cancel();
        }
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        event.preventDefault();
        if (!event.isTrusted) return;
        if (showResult) return;
        const key = event.key;

        setResultData(prev => ({
            ...prev,
            startTime: prev.startTime || Date.now(),
        }))

        // block extra keys 
        if (key.length > 1 && key !== "Backspace") return;

        setIsTyping(true);
        setHideStats(true);
        checkIsTypingRef.current();

        // add more words 
        if (key === " ") {
            requestAnimationFrame(() => {
                if (!containerRef.current) return;
                const cursorLine = getCursorLineIndex(activeWordIndex, containerRef);
                const totalLines = getLineCount(containerRef);

                if (!cursorLine) return;

                const remLines = totalLines - cursorLine;

                if (remLines <= 1 && !lineLockRef.current) {
                    const removeCount = removeFirstLine(containerRef);

                    if (removeCount && removeCount > 0) {
                        setWords(prev => prev.slice(removeCount));
                        setActiveWordIndex(prev => Math.max(prev - removeCount, 0));
                    }

                    lineLockRef.current = true;

                    requestAnimationFrame(() => {
                        addOneLineOfWords(containerRef, setWords);
                        lineLockRef.current = false;
                    });
                }

            });
        }

        // if rich end 
        if (activeWordIndex === words.length - 1 &&
            activeCharIndex === words[activeWordIndex].length) {
            return;
        }

        const currentWord = words[activeWordIndex];

        if (key === " " && activeCharIndex === currentWord.length) {
            event.preventDefault();
            setActiveWordIndex(prev => prev + 1);
            setWordCount(prev => prev + 1);
            setActiveCharIndex(0);
            setResultData(prev => ({
                ...prev,
                words: {
                    correct: prev.words.correct + 1,
                }
            }))
            return;
        }

        if (key === "Backspace" && activeCharIndex > 0) {
            setActiveCharIndex(prev => prev - 1);
            setResultData(prev => ({
                ...prev,
                totalKeystrokes: prev.totalKeystrokes + 1,
                backspaces: prev.backspaces + 1,
            }))
            return;
        }

        if (key === "Backspace" && activeCharIndex === 0) return;

        if (key === " ") return;

        setActiveCharIndex(prev => {
            const isCorrect = currentWord[prev] === key;

            if (isCorrect) {
                setIsIncorrect(false);
                setWrongKeyCount(0);
            } else {
                setIsIncorrect(true);
                setWrongKeyCount(prev => prev + 1);
            }
            setResultData(prev => ({
                ...prev,
                totalKeystrokes: prev.totalKeystrokes + 1,
                typedChars: prev.typedChars + 1,
                correctChars: isCorrect ? prev.correctChars + 1 : prev.correctChars,
                incorrectChars: !isCorrect ? prev.incorrectChars + 1 : prev.incorrectChars,
            }));
            return isCorrect ? prev + 1 : prev;
        });
        setInputChar(key);
    }, [activeCharIndex, activeWordIndex, words, setHideStats, checkIsTypingRef, showResult]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        const char = document.querySelector(
            `.char[data-word="${activeWordIndex}"][data-char="${activeCharIndex}"]`
        ) as HTMLElement;

        if (!char || !cursorRef.current || !containerRef.current) return;

        const charRect = char.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const x = charRect.left - containerRect.left;
        const y = charRect.top - containerRect.top;

        cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;

    }, [activeWordIndex, activeCharIndex]);


    useEffect(() => {
        if (!isIncorrect || !incorrectRef.current) return;

        const char = document.querySelector(
            `.char[data-word="${activeWordIndex}"][data-char="${activeCharIndex}"]`
        ) as HTMLElement;

        if (!char || !containerRef.current) return;

        const charRect = char.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const x = charRect.left - containerRect.left;
        const y = charRect.top - containerRect.top;

        incorrectRef.current.style.setProperty("--x", `${x}px`);
        incorrectRef.current.style.setProperty("--y", `${y}px`);
    }, [isIncorrect, wrongKeyCount, activeCharIndex, activeWordIndex]);

    // useEffect(() => {
    //     const unlockAudio = () => {
    //         initTypingSound();
    //         window.removeEventListener("keydown", unlockAudio);
    //     };

    //     window.addEventListener("keydown", unlockAudio);

    //     return () => window.removeEventListener("keydown", unlockAudio);
    // }, []);

    // handle result 
    useEffect(() => {
        const t = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => {
            clearTimeout(t);
        };
    }, [loading]);

    return (
        <>
            {
                loading && (
                    <div className="fixed top-0 left-0 z-20 bg-[#222227] w-full h-screen flex items-center justify-center">
                        <Loader />
                    </div>
                )
            }

            <Activity mode={`${showResult ? "visible" : "hidden"}`}>
                <ResultModal
                    resultData={resultData}
                    reset={reset}
                />
            </Activity>
            <div className="container mx-auto mt-28 select-none">
                <div className="words max-[650]:px-4 w-full max-w-6xl mx-auto flex justify-center flex-col mt-20">
                    <div className="w-full flex items-center justify-between mb-5">
                        <div className="flex text-3xl max-[650px]:text-[25px] items-center justify-center gap-3">
                            <span className=" text-orange-400">
                                <LuCircleDot />
                            </span>
                            <h3 className=" text-orange-400">{initialSetting.mode === "words" ? `${wordCount}/${initialSetting.wordCount}` : wordCount}</h3>
                        </div>

                        {initialSetting.mode === "time" && (<Timer
                            // key={initialSetting.duration}
                            duration={initialSetting.duration}
                            isTyping={isTyping}
                            setShowResult={setShowResult}
                            setResultData={setResultData}
                            timerResetKey={timerResetKey}
                            setHideStats={setHideStats}
                        />)}
                    </div>
                    <div
                        ref={containerRef}
                        className="w-full text-[33px] max-[650px]:text-[25px] mt-5 select-none inline-flex flex-wrap relative"
                    >
                        {words.map((word, index) => (
                            <div
                                key={`${word}-${index}`}
                                className="word inline-flex my-0.75"
                            >
                                {word.split("").map((char, charIndex) => (
                                    <span
                                        key={`${index}-${charIndex}`}
                                        data-word={index}
                                        data-char={charIndex}
                                        className={`char ${activeWordIndex > index ||
                                            (activeWordIndex === index && activeCharIndex > charIndex)
                                            ? "text-[#dbdbdb]"
                                            : "text-[#626268]"
                                            }`}
                                    >
                                        {char}
                                    </span>
                                ))}
                                <span
                                    data-word={index}
                                    data-char={word.length}
                                    className="char caret-end"
                                >
                                    &nbsp;
                                </span>
                            </div>
                        ))}

                        {
                            isIncorrect && (
                                <span
                                    ref={incorrectRef}
                                    key={`${activeWordIndex}-${activeCharIndex}-${wrongKeyCount}`}
                                    className="absolute text-3xl top-5 text-red-600 incorrect-animate">
                                    {inputChar}
                                </span>
                            )
                        }

                        <div
                            ref={cursorRef}
                            className={`cursor absolute max-sm:h-7 h-10 w-0.75 bg-orange-400 top-1.25 left-0 ${!isTyping ? "animate-blink" : ""}`}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}