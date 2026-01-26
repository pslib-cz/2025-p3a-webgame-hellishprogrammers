export interface GameMusicContextType {
    musicTracks: string[];
    isLoaded: boolean;
    currentTrack: string;
    setCurrentTrack: (track: string) => void;
}
