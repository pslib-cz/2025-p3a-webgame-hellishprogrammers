import { createContext, type FC, type PropsWithChildren, useEffect, useRef } from "react";
import { useGameData } from "../hooks/providers/useGameData";
import useGameProperties from "../hooks/providers/useGameProperties";
import type { BuildingTileType } from "../types";

type BuildingsBitmapContextValue = {
    images: ImageBitmap[];
};

const BACKGROUND_COLOR_MAP: Record<string, string> = {
    extractional: "#1982C4",
    industrial: "#6A4C93",
    commercial: "#FF595E",
    residential: "#FFCA3A",
    recreational: "#8AC926",
};

const OUTLINE_COLOR_MAP: Record<string, string> = {
    tile: "#19191921",
    building: "#191919",
    // selected: "#FEFAE0",
    // highlight: "#FEFAE0",
};

const ICON_COLOR = "#FEFAE0";

export const BuildingsBitmapContext = createContext<BuildingsBitmapContextValue | null>(null);

export const BuildingsBitmapProvider: FC<PropsWithChildren> = ({ children }) => {
    // const [images, setImages] = useState<ImageBitmap[]>([]);
    const images = useRef<ImageBitmap[]>([]);
    const { buildings } = useGameData();
    const { TILE_SIZE } = useGameProperties();

    // Generating bitmap for each building (Once)
    useEffect(() => {
        buildings.forEach((building) => {
            // Dimensions of building
            const width = building.shape[0].length * TILE_SIZE;
            const height = building.shape.length * TILE_SIZE;

            // Constants
            const iconOffset = TILE_SIZE / 2;
            const strokeWidth = 1;

            const canvas: OffscreenCanvas = new OffscreenCanvas(width, height);

            const context = canvas.getContext("2d");
            if (!context) {
                return;
            }

            // The ends of lines are squared off
            context.lineCap = "square";

            // Drawing tiles
            for (let y = 0; y < building.shape.length; y++) {
                for (let x = 0; x < building.shape[y].length; x++) {
                    const tile: BuildingTileType = building.shape[y][x];
                    if (tile === "Empty") continue;

                    // Relative position of tile in building
                    const relX = x * TILE_SIZE;
                    const relY = y * TILE_SIZE;

                    // Draw tile
                    context.fillStyle = BACKGROUND_COLOR_MAP[building.type.toLowerCase()];
                    context.fillRect(relX, relY, TILE_SIZE, TILE_SIZE);

                    // Draw tile border
                    context.strokeStyle = OUTLINE_COLOR_MAP["tile"];
                    context.lineWidth = strokeWidth;

                    // Begins the path
                    context.beginPath();

                    context.moveTo(relX, relY);
                    context.lineTo(relX + TILE_SIZE, relY);
                    context.lineTo(relX + TILE_SIZE, relY + TILE_SIZE);
                    context.lineTo(relX, relY + TILE_SIZE);
                    context.lineTo(relX, relY);

                    // Draws the path
                    context.stroke();

                    // Draw icon
                    if (tile === "Icon") {
                        context.fillStyle = ICON_COLOR;
                        context.textAlign = "center";
                        context.textBaseline = "middle";
                        context.font = `${(40 / 64) * TILE_SIZE}px icons`;
                        context.fillText(building.iconKey.toLowerCase(), relX + iconOffset, relY + iconOffset);
                    }
                }
            }
            // Converting canvas to bitmap
            images.current.push(canvas.transferToImageBitmap());
        });
    }, []);

    return (
        <BuildingsBitmapContext.Provider value={{ images: images.current }}>{children}</BuildingsBitmapContext.Provider>
    );
};
