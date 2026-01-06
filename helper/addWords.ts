import { generateWords, getCursorLineIndex, getLineCount } from "@/utils/generate";
import { removeFirstLine } from "./removeWordsLine";

export function getLastLineWordCount(containerRef: React.RefObject<HTMLDivElement | null>) {
    if (!containerRef.current) return 0;

    const words = Array.from(
        containerRef.current.querySelectorAll(".word")
    ) as HTMLElement[];

    if (!words.length) return 0;

    const lastTop = words[words.length - 1].offsetTop;

    let count = 0;
    for (let i = words.length - 1; i >= 0; i--) {
        if (words[i].offsetTop === lastTop) count++;
        else break;
    }

    return count;
};


export function addOneLineOfWords(containerRef: React.RefObject<HTMLDivElement | null>,
    setWords: React.Dispatch<React.SetStateAction<string[]>>) {
    if (!containerRef.current) return;

    const getLastLineTop = () => {
        const els = Array.from(
            containerRef.current!.querySelectorAll(".word")
        ) as HTMLElement[];

        return els.length
            ? els[els.length - 1].offsetTop
            : 0;
    };

    const startTop = getLastLineTop();

    const tryAdd = () => {
        const word = generateWords(1)[0];
        setWords(prev => [...prev, word]);

        requestAnimationFrame(() => {
            const newTop = getLastLineTop();
            if (newTop === startTop) {
                tryAdd();
            }
        });
    };

    tryAdd();
};

export const getLineTops = (containerRef: React.RefObject<HTMLDivElement | null>) => {
    if (!containerRef.current) return [];

    const words = Array.from(
        containerRef.current.querySelectorAll(".word")
    ) as HTMLElement[];

    const tops: number[] = [];
    words.forEach(w => {
        if (!tops.includes(w.offsetTop)) {
            tops.push(w.offsetTop);
        }
    });

    return tops;
};

export function addMoreWords(char: string,
    containerRef: React.RefObject<HTMLDivElement | null>,
    activeWordIndex: number,
    lineLockRef: React.RefObject<boolean>,
    setWords: React.Dispatch<React.SetStateAction<string[]>>,
    setActiveWordIndex: React.Dispatch<React.SetStateAction<number>>) {

    if (char !== " ") return;

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
    })
}