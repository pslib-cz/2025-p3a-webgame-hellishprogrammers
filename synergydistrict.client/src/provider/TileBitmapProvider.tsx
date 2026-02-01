import { createContext, useEffect, useMemo, useState, type FC, type PropsWithChildren } from "react";
import useGameProperties from "../hooks/providers/useGameProperties";
import useFont from "../hooks/useFont";

const BACKGROUND_COLOR_MAP: Record<string, string> = {
    water: "#5d8a9e",
    grass: "#8a9e5d",
    mountain: "#9e7b5d",
    forest: "#8a9e5d",
};

const ICON_COLOR_MAP: Record<string, string> = {
    water: "#124559",
    grass: "#606C38",
    mountain: "#8F531D",
    forest: "#283618",
};

const TILE_PADDING = 2;

export type TileBitmapContextValue = {
    tileBitmaps: Record<string, { bitmap: ImageBitmap; hasIcon: boolean }>;
    tileSize: number;
    loading: boolean;
};

export const TileBitmapContext = createContext<TileBitmapContextValue | null>(null);

const prepareTileBitmap = (
    tileType: string,
    hasIcon: boolean,
    tileSize: number,
): { bitmap: ImageBitmap; hasIcon: boolean } | null => {
    const canvas = new OffscreenCanvas(tileSize + TILE_PADDING, tileSize + TILE_PADDING);
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.fillStyle = BACKGROUND_COLOR_MAP[tileType.toLowerCase()] ?? "#ccc";
    context.fillRect(0, 0, tileSize + TILE_PADDING, tileSize + TILE_PADDING);

    context.fillStyle = ICON_COLOR_MAP[tileType.toLowerCase()] ?? "#000000";

    if (hasIcon) {
        const iconOffset = tileSize / 2;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `${(40 / 64) * tileSize}px icons`;
        context.fillText(tileType.toLowerCase(), iconOffset, iconOffset);
    }

    return { bitmap: canvas.transferToImageBitmap(), hasIcon };
};

export const TileBitmapProvider: FC<PropsWithChildren> = ({ children }) => {
    const { TILE_SIZE } = useGameProperties();
    const [tileBitmaps, setTileBitmaps] = useState<Record<string, { bitmap: ImageBitmap; hasIcon: boolean }>>({});
    const [loading, setLoading] = useState(true);
    const fontsLoaded = useFont('16px "icons"');

    useEffect(() => {
        if (!fontsLoaded) return;

        const tileTypes = ["water", "grass", "mountain", "forest"];
        const bitmaps: Record<string, { bitmap: ImageBitmap; hasIcon: boolean }> = {};

        for (const tileType of tileTypes) {
            const withIcon = prepareTileBitmap(tileType, true, TILE_SIZE);
            const withoutIcon = prepareTileBitmap(tileType, false, TILE_SIZE);

            if (withIcon) bitmaps[`${tileType}_icon`] = withIcon;
            if (withoutIcon) bitmaps[`${tileType}_no_icon`] = withoutIcon;
        }

        setTileBitmaps(bitmaps);
        setLoading(false);

        return () => {
            Object.values(bitmaps).forEach(({ bitmap }) => bitmap.close());
        };
    }, [TILE_SIZE, fontsLoaded]);

    const value = useMemo<TileBitmapContextValue>(
        () => ({ tileBitmaps, tileSize: TILE_SIZE, loading }),
        [tileBitmaps, TILE_SIZE, loading]
    );

    return <TileBitmapContext.Provider value={value}>{children}</TileBitmapContext.Provider>;
};
