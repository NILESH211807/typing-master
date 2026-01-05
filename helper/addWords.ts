import { generateWords } from "@/utils/generate";

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

export const removeFirstLine = (containerRef: React.RefObject<HTMLDivElement | null>,
    setWords: React.Dispatch<React.SetStateAction<string[]>>,
    setActiveWordIndex: React.Dispatch<React.SetStateAction<number>>) => {
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

const addOneFullLine = (containerRef: React.RefObject<HTMLDivElement | null>,
    setWords: React.Dispatch<React.SetStateAction<string[]>>
) => {
    if (!containerRef.current) return;

    const words = Array.from(
        containerRef.current.querySelectorAll(".word")
    ) as HTMLElement[];

    const lastTop =
        words.length > 0 ? words[words.length - 1].offsetTop : null;

    const addNext = () => {
        const word = generateWords(1)[0];
        setWords(prev => [...prev, word]);

        requestAnimationFrame(() => {
            const updated = Array.from(
                containerRef.current!.querySelectorAll(".word")
            ) as HTMLElement[];

            const newTop =
                updated[updated.length - 1].offsetTop;

            // keep adding while still same line
            if (lastTop !== null && newTop === lastTop) {
                addNext();
            }
        });
    };

    addNext();
};

export const adjustLinesToTarget = (targetLines = 4,
    containerRef: React.RefObject<HTMLDivElement | null>,
    setWords: React.Dispatch<React.SetStateAction<string[]>>,
    setActiveWordIndex: React.Dispatch<React.SetStateAction<number>>
) => {
    if (!containerRef.current) return;

    const adjust = () => {
        const lineTops = getLineTops(containerRef);
        const lineCount = lineTops.length;

        if (lineCount > targetLines) {
            removeFirstLine(containerRef, setWords, setActiveWordIndex);
            requestAnimationFrame(adjust);
            return;
        }

        if (lineCount < targetLines) {
            addOneFullLine(containerRef, setWords);
            requestAnimationFrame(adjust);
            return;
        }
    };

    adjust();
};






// export const addOneLineOfWords = (
//     containerRef: React.RefObject<HTMLDivElement | null>,
//     setWords: React.Dispatch<React.SetStateAction<string[]>>
// ) => {
//     if (!containerRef.current) return;

//     const getLastLineTop = () => {
//         const els = Array.from(
//             containerRef.current!.querySelectorAll(".word")
//         ) as HTMLElement[];

//         return els.length ? els[els.length - 1].offsetTop : 0;
//     };

//     const startTop = getLastLineTop();

//     const tryAdd = () => {
//         const newWord = generateWords(1)[0];

//         setWords(prev => [...prev, newWord]);

//         requestAnimationFrame(() => {
//             const newTop = getLastLineTop();

//             if (newTop === startTop) {
//                 // still same line → keep adding
//                 tryAdd();
//             }
//         });
//     };

//     tryAdd();
// };

