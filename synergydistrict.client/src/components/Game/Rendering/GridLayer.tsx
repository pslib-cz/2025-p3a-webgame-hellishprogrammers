import { Image, Layer } from "react-konva";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import type { Position } from "../../../types/Game/Grid";
import useGameMapData from "../../../hooks/providers/useMapData";

type GridLayerProp = {
    gridImage: ImageBitmap | null;
};

const GridLayer: React.FC<GridLayerProp> = ({ gridImage }) => {
    const { TILE_SIZE, CHUNK_SIZE } = useGameProperties();
    const { GameMapData } = useGameMapData();

    if (!gridImage) {
        return null;
    }

    const chunkPixelSize = CHUNK_SIZE * TILE_SIZE;

    const gridImages = [];

    for (const [chunkKey, chunkData] of Object.entries(GameMapData.loadedChunks)) {
        const [chunkX, chunkY] = chunkKey.split(";").map(Number);
        gridImages.push(
            <Image
                key={chunkKey}
                x={chunkX * chunkPixelSize}
                y={chunkY * chunkPixelSize}
                width={gridImage.width}
                height={gridImage.height}
                image={gridImage}
                listening={false}
                opacity={0.5}
            />
        );
    }
    


    return <Layer listening={false}>{gridImages}</Layer>;
};

export default GridLayer;
