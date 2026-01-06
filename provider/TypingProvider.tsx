"use client";
import { ResultDataType } from "@/components/TextDisplay";
import { createContext, useContext, useEffect, useState } from "react";

export type DataType = {
    duration: number;
    mode: string;
    wordCount: number;
    sound: boolean;
};

type TypingContextType = {
    initialSetting: DataType;
    setInitialSetting: React.Dispatch<React.SetStateAction<DataType>>;
    defaultResult: ResultDataType;
};

const defaultData: DataType = {
    duration: 120,
    mode: "time",
    wordCount: 50,
    sound: true,
}

const TypingContext = createContext<TypingContextType | undefined>(undefined);

export const TypingProvider = ({ children }: { children: React.ReactNode }) => {
    const [initialSetting, setInitialSetting] = useState<DataType>(
        () => {
            const stored = localStorage.getItem("initialSetting");
            return stored ? JSON.parse(stored) : defaultData;
        }
    );

    const defaultResult = {
        startTime: 0,
        endTime: 0,
        totalKeystrokes: 0,
        typedChars: 0,
        correctChars: 0,
        incorrectChars: 0,
        backspaces: 0,
        words: {
            correct: 0,
        },
    }

    // useEffect(() => {
    //     const stored = localStorage.getItem("initialSetting");
    //     if (stored) {
    //         setInitialSetting(JSON.parse(stored));
    //     }
    // }, []);

    // if any changes in the initialSetting, save it to local storage
    useEffect(() => {
        localStorage.setItem("initialSetting", JSON.stringify(initialSetting));
    }, [initialSetting]);

    const values = {
        initialSetting,
        setInitialSetting,
        defaultResult
    }

    return (
        <TypingContext.Provider value={values}>
            {children}
        </TypingContext.Provider>
    );
};

export const useTyping = () => {
    const context = useContext(TypingContext);
    if (!context) {
        throw new Error("useTyping must be used within a TypingProvider");
    }
    return context;
};

export default TypingContext;
