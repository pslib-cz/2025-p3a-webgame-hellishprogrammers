import type { MapTile, Position } from "../../../../types/Game/Grid";

const TILE_PADDING = 2;

export type PreparedChunkCanvas = {
    img: ImageBitmap;
    width: number;
    height: number;
};

type PrepareChunkCanvasParams = {
    tiles: MapTile[];
    chunkOrigin: Position;
    tileSize: number;
    chunkSize: number;
    tileBitmaps: Record<string, { bitmap: ImageBitmap; hasIcon: boolean }>;
    debug?: boolean;
};

export const prepareChunk = ({
    tiles,
    chunkOrigin,
    tileSize,
    chunkSize,
    tileBitmaps,
    debug = false,
}: PrepareChunkCanvasParams): PreparedChunkCanvas | null => {
    if (tiles.length === 0) {
        return null;
    }

    const width = chunkSize * tileSize + TILE_PADDING;
    const height = chunkSize * tileSize + TILE_PADDING;

    const canvas: OffscreenCanvas = new OffscreenCanvas(width, height);

    const context = canvas.getContext("2d");
    if (!context) {
        return null;
    }

    for (const tile of tiles) {
        const relX = (tile.position.x - chunkOrigin.x) * tileSize;
        const relY = (tile.position.y - chunkOrigin.y) * tileSize;

        const tileKey = `${tile.tileType.toLowerCase()}_${tile.hasIcon ? 'icon' : 'no_icon'}`;
        const tileBitmap = tileBitmaps[tileKey];

        if (tileBitmap) {
            context.drawImage(tileBitmap.bitmap, relX, relY);
        }

        if (debug) {
            context.fillStyle = "#000000";
            context.textAlign = "start";
            context.textBaseline = "top";
            context.font = "10px Roboto Mono";
            context.fillText(`${tile.position.x};${tile.position.y}`, relX + 4, relY + 4 + TILE_PADDING / 2);
        }
    }

    return { img: canvas.transferToImageBitmap(), width, height };
};

export default prepareChunk;
