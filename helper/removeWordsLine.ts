
export function removeFirstLine(containerRef: React.MutableRefObject<HTMLDivElement | null>) {
    if (!containerRef.current) return;

    const wordElems = Array.from(
        containerRef.current.querySelectorAll(".word")
    ) as HTMLDivElement[];

    if (wordElems.length === 0) return;

    const firstLineTop = wordElems[0].offsetTop;

    let removeCount = 0;

    for (const elem of wordElems) {
        if (elem.offsetTop === firstLineTop) removeCount++;
        else break;
    }

    if (removeCount > 0) {
        return removeCount;
    }
}