import { useCallback, useEffect } from "react";
import { useSettings } from "./providers/useSettings";

export const SOUNDS = {
    CLICK: "/audio/sfx/click.mp3",
    DELETE: "/audio/sfx/delete.ogg",
    SELECT: "/audio/sfx/select.ogg",
    HOVER: "/audio/sfx/hover.ogg",
    ERROR: "/audio/sfx/error.mp3",
    SUCCESS: "/audio/sfx/success.mp3",
} as const;

export type SoundPath = keyof typeof SOUNDS | (string & {});

const audioCache: Record<string, HTMLAudioElement> = {};

export const useSound = (sound: SoundPath, volume: number = 1.0) => {
    const { gameSettings } = useSettings();
    const soundPath = sound in SOUNDS ? SOUNDS[sound as keyof typeof SOUNDS] : sound;

    useEffect(() => {
        if (!audioCache[soundPath]) {
            const audio = new Audio(soundPath);
            audio.load();
            audioCache[soundPath] = audio;
        }
    }, [soundPath]);

    const play = useCallback(() => {
        if (!gameSettings.isSound) return;

        try {
            const baseAudio = audioCache[soundPath] || new Audio(soundPath);
            const audio = baseAudio.cloneNode() as HTMLAudioElement;
            audio.volume = volume;

            audio.play().catch((e) => {
                if (e.name !== "AbortError") console.warn("Audio playback failed:", e);
            });
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    }, [soundPath, volume, gameSettings.isSound]);

    return play;
};
