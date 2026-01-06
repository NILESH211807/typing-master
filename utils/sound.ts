let audioCtx: AudioContext | null = null;
let keyBuffer: AudioBuffer | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export const initTypingSound = async () => {
    if (audioCtx) return;

    audioCtx = new AudioContext();

    const res = await fetch("https://ik.imagekit.io/9kvz9l4o8/sound/correct.mp3");
    const arrayBuffer = await res.arrayBuffer();
    keyBuffer = await audioCtx.decodeAudioData(arrayBuffer);
}

export const playTypingSound = () => {
    if (!audioCtx || !keyBuffer) return;

    if (currentSource) {
        try {
            currentSource.stop();
        } catch (_) { }
        currentSource.disconnect();
        currentSource = null;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = keyBuffer;

    source.playbackRate.value = 0.95 + Math.random() * 0.1;

    source.connect(audioCtx.destination);
    source.start(0);

    currentSource = source;
};
