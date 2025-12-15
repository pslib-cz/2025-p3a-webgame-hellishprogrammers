import { Layer } from "react-konva";
import type { MapTile, Position } from "../../../types/Grid"
import ChunkShape from "./ChunkShape";

type MapLayerProps = {
    chunks: Record<string, MapTile[]>
    TILE_SIZE: number,
}

const MapLayer: React.FC<MapLayerProps> = ({ chunks, TILE_SIZE }) => {

    const getChunks = () => {
        const chunksWithPos: { position: Position, tiles: MapTile[] }[] = []
        Object.entries(chunks).forEach(([k, chunk]) => {
            const [x, y] = k.split(";").map(Number);
            chunksWithPos.push({
                position: { x, y },
                tiles: chunk
            });
        });

        return (
            <>
                {chunksWithPos.map(chp =>
                    <ChunkShape key={`${chp.position.x};${chp.position.y}`} tiles={chp.tiles} origin={chp.position} TILE_SIZE={TILE_SIZE} debug={false} />
                )}
            </>
        );
    }

    return (
        <Layer listening={false}>
            {getChunks()}
        </Layer>
    );
}

export default MapLayer;