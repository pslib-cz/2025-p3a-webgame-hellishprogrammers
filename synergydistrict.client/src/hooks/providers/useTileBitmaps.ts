import { useContext } from "react";
import { TileBitmapContext, type TileBitmapContextValue } from "../../provider/TileBitmapProvider";

export const useTileBitmaps = (): TileBitmapContextValue => {
    const context = useContext(TileBitmapContext);
    if (!context) {
        throw new Error("useTileBitmaps must be used within a TileBitmapProvider");
    }
    return context;
};

export default useTileBitmaps;
