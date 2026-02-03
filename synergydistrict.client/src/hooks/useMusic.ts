import { useEffect, useRef, useState } from "react";

const availableAudioTracks = [
    "/audio/loading.mp3",
    "/audio/menu_music.mp3",
    "/audio/game-music/01 - cheezy-80s-synth-tune-background-music-instrumental-297048.mp3",
    "/audio/game-music/02 - go-for-it-80s-cheesy-vhs-infomercial-synthpop-soundtrack-187085.mp3",
    "/audio/game-music/03 - level-ix-short-211052.mp3",
    "/audio/game-music/04 - game-8-bit-328398.mp3",
    "/audio/game-music/05 - news-summary-449042.mp3",
    "/audio/game-music/06 - retro-game-arcade-236133.mp3",
    "/audio/game-music/07 - sandy-vibe-summer-background-tropical-house-for-video-full-version-471397.mp3",
];

export type MusicOptions = {
    songsPath: string[];
    volume: number;
    timeBetweenSongs: number;
    isEnabled: boolean;
    mode: "single" | "random";
};

export type AudioData = {
    audioElement: HTMLAudioElement;
    name: string;
};

const useMusic = (musicOptions: MusicOptions) => {
    const [currentTrack, setCurrentTrack] = useState<string>("");
    const [canPlayAudio, setCanPlayAudio] = useState<boolean>(false);
    const canPlayAudioRef = useRef<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playedTracksRef = useRef<number[]>([]);
    const timeoutRef = useRef<number | null>(null);
    const tracksRef = useRef<string[]>([]);
    const handlersRef = useRef<{
        playRandomTrack: () => void;
        playSingleTrack: () => void;
        handleSongEnd: () => void;
    } | null>(null);

    const { songsPath, volume, timeBetweenSongs, isEnabled, mode } = musicOptions;
    const songsPathKey = JSON.stringify(songsPath);

    useEffect(() => {
        const enableAudio = () => {
            canPlayAudioRef.current = true;
            setCanPlayAudio(true);
        };

        const testAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        testAudio.volume = 0;
        const playPromise = testAudio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    testAudio.pause();
                    canPlayAudioRef.current = true;
                    setCanPlayAudio(true);
                })
                .catch(() => {
                    const events = ['click', 'keydown', 'touchstart'];
                    events.forEach(event => document.addEventListener(event, enableAudio, { once: true }));
                });
        } else {
            const events = ['click', 'keydown', 'touchstart'];
            events.forEach(event => document.addEventListener(event, enableAudio, { once: true }));
        }

        return () => {
            const events = ['click', 'keydown', 'touchstart'];
            events.forEach(event => document.removeEventListener(event, enableAudio));
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.volume = volume;
        }

        const loadedTracks = loadAudioPaths(songsPath);
        tracksRef.current = loadedTracks;

        if (loadedTracks.length === 0) {
            return;
        }

        const playTrack = (trackPath: string) => {
            const trackName =
                trackPath
                    .split("/")
                    .pop()
                    ?.replace(/\.(mp3|wav|ogg)$/, "") || "Unknown";
            setCurrentTrack(trackName);

            if (audioRef.current) {
                audioRef.current.src = trackPath;
                if (isEnabled && canPlayAudioRef.current) {
                    audioRef.current.play().catch((err) => {
                        console.error('Failed to play audio:', err);
                    });
                } else {
                }
            }
        };

        const playRandomTrack = () => {
            const tracks = tracksRef.current;
            if (tracks.length === 0) return;

            if (playedTracksRef.current.length === tracks.length) {
                playedTracksRef.current = [];
            }

            const availableIndices = tracks
                .map((_, index) => index)
                .filter((index) => !playedTracksRef.current.includes(index));

            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            playedTracksRef.current.push(randomIndex);

            playTrack(tracks[randomIndex]);
        };

        const playSingleTrack = () => {
            const tracks = tracksRef.current;
            if (tracks.length > 0) {
                playTrack(tracks[0]);
            }
        };

        const handleSongEnd = () => {
            setCurrentTrack("");
            if (mode === "random") {
                timeoutRef.current = setTimeout(() => handlersRef.current?.playRandomTrack(), timeBetweenSongs);
            } else {
                timeoutRef.current = setTimeout(() => handlersRef.current?.playSingleTrack(), timeBetweenSongs);
            }
        };

        handlersRef.current = { playRandomTrack, playSingleTrack, handleSongEnd };

        if (audioRef.current) {
            audioRef.current.removeEventListener("ended", handleSongEnd);
            audioRef.current.addEventListener("ended", handleSongEnd);
            audioRef.current.volume = volume;
        }

        if (mode === "random") {
            playRandomTrack();
        } else {
            playSingleTrack();
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener("ended", handleSongEnd);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [songsPathKey, volume, timeBetweenSongs, mode, isEnabled]);

    // Handle when audio becomes playable or isEnabled changes
    useEffect(() => {
       
        if (audioRef.current && audioRef.current.src) {
            if (isEnabled && canPlayAudio) {

                audioRef.current.play().catch((err) => {
                    console.error('Failed to play from effect:', err);
                });
            } else if (!isEnabled) {
                audioRef.current.pause();
            }
        }
    }, [isEnabled, canPlayAudio]);

    return { currentTrack };
};

function loadAudioPaths(songPaths: string[]): string[] {
    return availableAudioTracks.filter((track) => songPaths.some((p) => track.includes(p)));
}

export default useMusic;
