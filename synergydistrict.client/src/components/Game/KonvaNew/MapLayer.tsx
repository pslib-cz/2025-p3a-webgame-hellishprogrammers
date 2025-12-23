import { Layer } from "react-konva";
import type { MapTile, Position } from "../../../types/Game/Grid";
import ChunkShape from "./ChunkShape";
import useGameProperties from "../../../hooks/providers/useGameProperties";

type MapLayerProps = {
    chunks: Record<string, MapTile[]>;
    stageX: number;
    stageY: number;
    scale: number;
    width: number;
    height: number;
};

const MapLayer: React.FC<MapLayerProps> = ({ chunks, stageX, stageY, scale, width, height }) => {
    const { TILE_SIZE, CHUNK_SIZE } = useGameProperties();

    const chunksWithPos: { position: Position; tiles: MapTile[] }[] = [];

    const buffer = CHUNK_SIZE * TILE_SIZE;

    const minVisibleX = -stageX / scale - buffer;
    const maxVisibleX = (width - stageX) / scale + buffer;
    const minVisibleY = -stageY / scale - buffer;
    const maxVisibleY = (height - stageY) / scale + buffer;

    const chunkPixelSize = CHUNK_SIZE * TILE_SIZE;

    Object.entries(chunks).forEach(([k, chunk]) => {
        const [x, y] = k.split(";").map(Number);

        // Chunk top-left position in pixels
        const chunkX = x * CHUNK_SIZE * TILE_SIZE;
        const chunkY = y * CHUNK_SIZE * TILE_SIZE;

        // Axis-Aligned Bounding Box (AABB) Intersection Check
        // Check if the chunk rectangle overlaps with the visible rectangle
        if (
            chunkX < maxVisibleX &&
            chunkX + chunkPixelSize > minVisibleX &&
            chunkY < maxVisibleY &&
            chunkY + chunkPixelSize > minVisibleY
        ) {
            chunksWithPos.push({
                position: { x, y },
                tiles: chunk,
            });
        }
    });

    // console.log(chunksWithPos.length);

    return (
        <Layer listening={false}>
            {chunksWithPos.map((chp) => (
                <ChunkShape
                    key={`${chp.position.x};${chp.position.y}`}
                    tiles={chp.tiles}
                    origin={chp.position}
                    debug={false}
                />
            ))}
        </Layer>
    );
};

export default MapLayer;
