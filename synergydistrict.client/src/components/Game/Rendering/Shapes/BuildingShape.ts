import type { BuildingCategory, BuildingTileType } from "../../../../types";

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

export const createBuildingBitmap = (shape: BuildingTileType[][], category: BuildingCategory, iconKey: string,  TILE_SIZE: number) => {

    const width = shape[0].length * TILE_SIZE;
    const height = shape.length * TILE_SIZE;

    const iconOffset = TILE_SIZE / 2;
    const strokeWidth = 1;
    const borderOffset = strokeWidth / 2;

    const canvas: OffscreenCanvas = new OffscreenCanvas(width, height);

    const context = canvas.getContext("2d");
    if (!context) {
        return;
    }

    context.lineCap = "square";

    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            const tile: BuildingTileType = shape[y][x];
            if (tile === "Empty") continue;

            const relX = x * TILE_SIZE;
            const relY = y * TILE_SIZE;

            context.fillStyle = BACKGROUND_COLOR_MAP[category.toLowerCase()];
            context.fillRect(relX, relY, TILE_SIZE, TILE_SIZE);

            context.strokeStyle = OUTLINE_COLOR_MAP["tile"];
            context.lineWidth = strokeWidth;

            context.beginPath();

            context.moveTo(relX, relY);
            context.lineTo(relX + TILE_SIZE, relY);
            context.lineTo(relX + TILE_SIZE, relY + TILE_SIZE);
            context.lineTo(relX, relY + TILE_SIZE);
            context.lineTo(relX, relY);

            context.stroke();

            context.strokeStyle = OUTLINE_COLOR_MAP["building"];
            context.lineWidth = strokeWidth;

            context.beginPath();

            if (y === 0 || shape[y - 1][x] === "Empty") {
                context.moveTo(relX + borderOffset, relY + borderOffset);
                context.lineTo(relX + TILE_SIZE - borderOffset, relY + borderOffset);
            }
            if (x === shape[y].length - 1 || shape[y][x + 1] === "Empty") {
                context.moveTo(relX + TILE_SIZE - borderOffset, relY + borderOffset);
                context.lineTo(relX + TILE_SIZE - borderOffset, relY + TILE_SIZE - borderOffset);
            }
            if (y === shape.length - 1 || shape[y + 1][x] === "Empty") {
                context.moveTo(relX + TILE_SIZE - borderOffset, relY + TILE_SIZE - borderOffset);
                context.lineTo(relX + borderOffset, relY + TILE_SIZE - borderOffset);
            }
            if (x === 0 || shape[y][x - 1] === "Empty") {
                context.moveTo(relX + borderOffset, relY + TILE_SIZE - borderOffset);
                context.lineTo(relX + borderOffset, relY + borderOffset);
            }

            context.stroke();

            if (tile === "Icon") {
                context.fillStyle = ICON_COLOR;
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.font = `${(40 / 64) * TILE_SIZE}px icons`;
                context.fillText(iconKey.toLowerCase(), relX + iconOffset, relY + iconOffset);
            }
        }
    }

    return canvas.transferToImageBitmap();
}