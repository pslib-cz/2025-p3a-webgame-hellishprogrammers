
type PrepareGridCanvasParams = {
	opacity: number;
	tileSize: number;
	chunkSize: number;
};

const GRID_COLOR = "#191919";
const GRID_LINE_WIDTH = 2.5;

export const prepareGrid = ({
	opacity,
	tileSize,
	chunkSize,
}: PrepareGridCanvasParams): ImageBitmap | null => {
	const width = chunkSize * tileSize;
	const height = chunkSize * tileSize;

	if (width === 0 || height === 0) {
		return null;
	}

	const canvas = new OffscreenCanvas(width, height);
	const context = canvas.getContext("2d");
	if (!context) {
		return null;
	}

	context.save();
	context.translate(0.5, 0.5);
	context.strokeStyle = GRID_COLOR;
	context.globalAlpha = opacity;
	context.lineWidth = GRID_LINE_WIDTH;
	context.beginPath();

	for (let x = 0; x <= chunkSize - 1; x++) {
		const px = x * tileSize;
		context.moveTo(px, 0);
		context.lineTo(px, height);
	}

	for (let y = 0; y <= chunkSize - 1; y++) {
		const py = y * tileSize;
		context.moveTo(0, py);
		context.lineTo(width, py);
	}

	context.stroke();
	context.restore();

	return canvas.transferToImageBitmap();

};

export default prepareGrid;
