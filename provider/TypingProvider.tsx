"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type DataType = {
    duration: number;
    mode: string;
    wordCount: number;
};

type TypingContextType = {
    initialSetting: DataType;
    setInitialSetting: React.Dispatch<React.SetStateAction<DataType>>;
};


const defaultData: DataType = {
    duration: 120,
    mode: "time",
    wordCount: 100,
}

const TypingContext = createContext<TypingContextType | undefined>(undefined);


export const TypingProvider = ({ children }: { children: React.ReactNode }) => {
    const [initialSetting, setInitialSetting] = useState<DataType>(
        JSON.parse(localStorage.getItem("initialSetting") || JSON.stringify(defaultData))
    );

    // if any changes in the initialSetting, save it to local storage
    useEffect(() => {
        localStorage.setItem("initialSetting", JSON.stringify(initialSetting));
    }, [initialSetting]);

    const values = {
        initialSetting,
        setInitialSetting,
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
