export function getTime(timer: number) {
    const mint = Math.floor(timer / 60);
    const sec = Math.floor(timer % 60);
    return `${String(mint).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

