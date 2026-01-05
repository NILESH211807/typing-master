import { getLastLineWordCount } from "@/helper/addWords";
import { generate } from "random-words";

export function generateWords(length = 20) {
    const result = generate({
        exactly: length,
        minLength: 3,
        maxLength: 10
    });
    return Array.isArray(result) ? result : [result];
};

export function getLineCount(containerRef: React.RefObject<HTMLDivElement | null>) {
    if (!containerRef.current) return 0;
    const words = Array.from(containerRef.current.querySelectorAll('.word')) as HTMLDivElement[];

    const uniqueTops = new Set<number>();

    words.forEach(word => {
        uniqueTops.add(word.offsetTop);
    });

    return uniqueTops.size;
}


export function getCursorLineIndex(activeWordIndex: number,
    containerRef: React.RefObject<HTMLDivElement | null>) {

    const nextChar = document.querySelector(
        `.char[data-word="${activeWordIndex + 1}"][data-char="0"]`
    ) as HTMLElement;

    if (!nextChar) return;

    const containerTop =
        containerRef.current!.getBoundingClientRect().top;
    const nextTop = nextChar.getBoundingClientRect().top;
    const lineHeight = parseFloat(
        getComputedStyle(containerRef.current!).lineHeight
    );

    const cursorLine = Math.floor((nextTop - containerTop) / lineHeight);

    return cursorLine;

}


// getLineTops
const getLineTops = (containerRef: React.RefObject<HTMLDivElement | null>) => {
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

const removeFirstLine = (containerRef: React.RefObject<HTMLDivElement | null>,
    setWords: React.Dispatch<React.SetStateAction<string[]>>,
    setActiveWordIndex: React.Dispatch<React.SetStateAction<number>>
) => {
    if (!containerRef.current) return 0;

    const words = Array.from(
        containerRef.current.querySelectorAll(".word")
    ) as HTMLElement[];

    if (!words.length) return 0;

    const firstTop = words[0].offsetTop;
    let count = 0;

    for (const w of words) {
        if (w.offsetTop === firstTop) count++;
        else break;
    }

    if (count > 0) {
        setWords(prev => prev.slice(count));
        setActiveWordIndex(prev => Math.max(prev - count, 0));
    }

    return count;
};



export const fillExactLines = (targetLines: number,
    containerRef: React.RefObject<HTMLDivElement | null>,
    setWords: React.Dispatch<React.SetStateAction<string[]>>
) => {
    if (!containerRef.current) return;

    const getLineCount = () => {
        const words = Array.from(
            containerRef.current!.querySelectorAll(".word")
        ) as HTMLElement[];

        const tops = new Set<number>();
        words.forEach(w => tops.add(w.offsetTop));
        return tops.size;
    };

    const getLastLineWordCount = () => {
        const words = Array.from(
            containerRef.current!.querySelectorAll(".word")
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

    const step = () => {
        const lines = getLineCount();

        if (lines <= targetLines) {
            const word = generateWords(1)[0];
            setWords(prev => [...prev, word]);
            requestAnimationFrame(step);
        }

        if (lines > targetLines) {
            const overflow = getLastLineWordCount();
            setWords(prev => prev.slice(0, -overflow));
        }
    };

    step();
};
