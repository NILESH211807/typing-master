import { useRef } from "react";

export function useTypingSound() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playSound = (url: string, volume = 0.6) => {
        // Stop previous sound
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        const audio = new Audio(url);
        audio.volume = volume;
        audioRef.current = audio;

        audio.play().catch(() => {
            // mobile autoplay restriction safe
        });
    };

    return { playSound };
}
