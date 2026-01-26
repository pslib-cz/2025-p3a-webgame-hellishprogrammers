
import { useContext } from "react";
import { GameMusicContext } from "./GameMusicProvider";

export const useGameMusic = () => {
    const context = useContext(GameMusicContext);
    if (!context) {
        throw new Error("useGameMusic must be used within GameMusicProvider");
    }
    return context;
};