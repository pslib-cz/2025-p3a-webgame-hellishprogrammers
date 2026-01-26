import { createContext, useState, useEffect, type ReactNode } from "react";
import type { GameMusicContextType } from "../../types/Game/GameMusic";

export const GameMusicContext = createContext<GameMusicContextType | undefined>(undefined);

const musicFiles = import.meta.glob("/public/audio/game-music/*.mp3", { eager: true, as: "url" });
const GAME_MUSIC_TRACKS = Object.keys(musicFiles).map((path) => path.replace("/public", ""));

export const GameMusicProvider = ({ children }: { children: ReactNode }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<string>("");

    useEffect(() => {
        // Simulate loading music files
        const loadMusic = async () => {
            // Preload all audio files
            const promises = GAME_MUSIC_TRACKS.map((track) => {
                return new Promise((resolve) => {
                    const audio = new Audio(track);
                    audio.addEventListener("canplaythrough", resolve, { once: true });
                    audio.addEventListener("error", resolve, { once: true }); // Resolve even on error
                    audio.load();
                });
            });

            await Promise.all(promises);
            setIsLoaded(true);
        };

        loadMusic();
    }, []);

    return (
        <GameMusicContext.Provider value={{ musicTracks: GAME_MUSIC_TRACKS, isLoaded, currentTrack, setCurrentTrack }}>
            {children}
        </GameMusicContext.Provider>
    );
};