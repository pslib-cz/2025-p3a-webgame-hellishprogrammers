import type { MapTile, Position } from "../../../types/Game/Grid";

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

export type PreparedChunkCanvas = {
	img: ImageBitmap
	width: number;
	height: number;
};

type PrepareChunkCanvasParams = {
	tiles: MapTile[];
	chunkOrigin: Position;
	tileSize: number;
	chunkSize: number;
	debug?: boolean;
};

export const prepareChunk = ({
	tiles,
	chunkOrigin,
	tileSize,
	chunkSize,
	debug = false,
}: PrepareChunkCanvasParams): PreparedChunkCanvas | null => {
	if (tiles.length === 0) {
		return null;
	}

	const width = chunkSize * tileSize + TILE_PADDING;
	const height = chunkSize * tileSize + TILE_PADDING;

	const canvas:OffscreenCanvas = new OffscreenCanvas(width, height);

	const context = canvas.getContext("2d");
	if (!context) {
		return null;
	}

	for (const tile of tiles) {
		const relX = (tile.position.x - chunkOrigin.x) * tileSize;
		const relY = (tile.position.y - chunkOrigin.y) * tileSize;
		const iconOffset = tileSize / 2;
		context.fillStyle = BACKGROUND_COLOR_MAP[tile.tileType.toLowerCase()] ?? "#ccc";
		context.fillRect(relX, relY, tileSize + TILE_PADDING, tileSize + TILE_PADDING);

		context.fillStyle = ICON_COLOR_MAP[tile.tileType.toLowerCase()] ?? "#000000";

		if (debug) {
			context.textAlign = "start";
			context.textBaseline = "top";
			context.font = "10px Roboto Mono";
			context.fillText(`${tile.position.x};${tile.position.y}`, relX + 4, relY + 4 + TILE_PADDING / 2);
		}

		if (tile.hasIcon) {
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.font = `${(40 / 64) * tileSize}px icons`;
			context.fillText(tile.tileType.toLowerCase(), relX + iconOffset, relY + iconOffset);
		}
	}

	return { img: canvas.transferToImageBitmap(), width, height };
};

export default prepareChunk;
