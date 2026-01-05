"use client";
import React, { useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import Timer from "./Timer";
import { generateWords, getCursorLineIndex, getLineCount } from "@/utils/generate";
import { removeFirstLine } from "@/helper/removeWordsLine";
import { addOneLineOfWords, getLastLineWordCount } from "@/helper/addWords";
import Loader from "./Loader";
import { LuCircleDot } from "react-icons/lu";

export default function TextDisplay() {
    const [words, setWords] = useState<string[]>(() => generateWords(5));
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
    const [activeCharIndex, setActiveCharIndex] = useState<number>(0);
    const [inputChar, setInputChar] = useState<string>("");
    const cursorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isIncorrect, setIsIncorrect] = useState(false);
    const incorrectRef = useRef<HTMLDivElement>(null);
    const [wrongKeyCount, setWrongKeyCount] = useState(0);
    const lineLockRef = useRef(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!containerRef.current) return;
        const TARGET_LINES = 4;
        const fillLines = () => {
            const lines = getLineCount(containerRef);

            if (lines <= TARGET_LINES) {
                const word = generateWords(1)[0];
                setWords(prev => [...prev, word]);
                requestAnimationFrame(fillLines);
            }
            if (lines > TARGET_LINES) {
                const overflowCount = getLastLineWordCount(containerRef);

                setWords(prev => prev.slice(0, -overflowCount));
            }
        };

        fillLines();
    }, []);


    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        event.preventDefault();
        if (!event.isTrusted) return;
        const key = event.key;

        // block extra keys 
        if (key.length > 1 && key !== "Backspace") return;

        // setIsTyping(true);

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
            setActiveCharIndex(0);
            return;
        }

        if (key === "Backspace" && activeCharIndex > 0) {
            setActiveCharIndex(prev => prev - 1);
            return;
        }

        if (key === "Backspace" && activeCharIndex === 0) return;

        if (key === " ") return;

        setActiveCharIndex(prev => {
            if (currentWord[prev] === key) {
                setIsIncorrect(false);
                setWrongKeyCount(0);
                return prev + 1;
            }
            setIsIncorrect(true);
            setWrongKeyCount(prev => prev + 1);
            return prev;
        });

        setInputChar(key);
    }, [activeCharIndex, activeWordIndex, words]);

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

    useEffect(() => {
        const t = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => {
            clearTimeout(t);
        };
    }, [loading])

    return (

        <>
            {
                loading && (
                    <div className="fixed top-0 left-0 z-20 bg-[#222227] w-full h-screen flex items-center justify-center">
                        <Loader />
                    </div>
                )
            }
            <div className="words max-[650]:px-4 w-full max-w-6xl mx-auto flex justify-center flex-col mt-20">
                <div className="w-full flex items-center justify-between mb-5">
                    <div className="flex text-3xl max-[650px]:text-[25px] items-center justify-center gap-3">
                        <span className=" text-orange-400">
                            <LuCircleDot />
                        </span>
                        <h3 className=" text-orange-400">{activeWordIndex}</h3>
                    </div>
                    <Timer isTyping={isTyping} />
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
                        className={`cursor absolute h-10 w-0.75 bg-orange-400 top-1.25 left-0 ${!isTyping ? "animate-blink" : ""}`}
                    />
                </div>
            </div>
        </>
    )
}