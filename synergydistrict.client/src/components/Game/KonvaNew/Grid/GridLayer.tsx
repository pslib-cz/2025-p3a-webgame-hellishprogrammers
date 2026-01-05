import { Image, Layer } from "react-konva";
import useGameProperties from "../../../../hooks/providers/useGameProperties";
import type { Position } from "../../../../types/Game/Grid";

type GridLayerProp = {
    origin: Position;
    chunkWidth: number;
    chunkHeight: number;
    gridImage: ImageBitmap | null;
};

const GridLayer: React.FC<GridLayerProp> = ({ origin, chunkWidth, chunkHeight, gridImage }) => {
    const { TILE_SIZE, CHUNK_SIZE } = useGameProperties();

    if (!gridImage) {
        return null;
    }

    const chunkPixelSize = CHUNK_SIZE * TILE_SIZE;

    const gridImages = [];
    for (let i = 0; i < chunkWidth; i++) {
        for (let j = 0; j < chunkHeight; j++) {
            const pos: Position = {
                x: (origin.x + i) * chunkPixelSize,
                y: (origin.y + j) * chunkPixelSize,
            };

            gridImages.push(
                <Image
                    key={`${origin.x + i}-${origin.y + j}`}
                    x={pos.x}
                    y={pos.y}
                    width={gridImage.width}
                    height={gridImage.height}
                    image={gridImage}
                    listening={false}
                />
            );
        }
    }

    return <Layer listening={false}>{gridImages}</Layer>;
};

export default GridLayer;
