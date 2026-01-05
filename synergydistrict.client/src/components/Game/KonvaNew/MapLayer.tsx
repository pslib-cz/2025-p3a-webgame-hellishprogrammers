import { Image, Layer } from "react-konva";
import type { MapTile, Position } from "../../../types/Game/Grid";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import type { PreparedChunkCanvas } from "../HTMLCanvas/ChunkShape";

type MapLayerProps = {
    chunks: Record<string, MapTile[]>;
    stageX: number;
    stageY: number;
    scale: number;
    width: number;
    height: number;
    chunkBitmaps: Record<string, PreparedChunkCanvas>;
};

const MapLayer: React.FC<MapLayerProps> = ({ chunks, stageX, stageY, scale, width, height, chunkBitmaps }) => {
    const { TILE_SIZE, CHUNK_SIZE } = useGameProperties();

    const chunksWithPos: { position: Position; key: string }[] = [];

    const buffer = CHUNK_SIZE * TILE_SIZE;

    const minVisibleX = -stageX / scale - buffer;
    const maxVisibleX = (width - stageX) / scale + buffer;
    const minVisibleY = -stageY / scale - buffer;
    const maxVisibleY = (height - stageY) / scale + buffer;

    const chunkPixelSize = CHUNK_SIZE * TILE_SIZE;

    Object.entries(chunks).forEach(([k]) => {
        const [x, y] = k.split(";").map(Number);

        const chunkX = x * CHUNK_SIZE * TILE_SIZE;
        const chunkY = y * CHUNK_SIZE * TILE_SIZE;

        if (
            chunkX < maxVisibleX &&
            chunkX + chunkPixelSize > minVisibleX &&
            chunkY < maxVisibleY &&
            chunkY + chunkPixelSize > minVisibleY
        ) {
            chunksWithPos.push({
                position: { x, y },
                key: k,
            });
        }
    });

    return (
        <Layer listening={false}>
            {chunksWithPos.map((chp) => {
                const prepared = chunkBitmaps[chp.key];
                if (!prepared) {
                    return null;
                }

                return (
                    <Image
                        key={`${chp.position.x};${chp.position.y}`}
                        x={chp.position.x * CHUNK_SIZE * TILE_SIZE}
                        y={chp.position.y * CHUNK_SIZE * TILE_SIZE}
                        width={prepared.width}
                        height={prepared.height}
                        image={prepared.img}
                        listening={false}
                    />
                );
            })}
        </Layer>
    );
};

export default MapLayer;
