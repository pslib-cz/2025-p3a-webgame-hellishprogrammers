import { Shape } from "react-konva";
import type { MapTile, Position } from "../../../types/Grid";
import type { Context } from "konva/lib/Context";
import type { Shape as KonvaShape } from "konva/lib/Shape";
import { useRef } from "react";

const BACKGROUND_COLOR_MAP: Record<string, string> = {
    "water": "#5d8a9e",
    "grass": "#8a9e5d",
    "mountain": "#9e7b5d",
    "forest": "#8a9e5d",
};

const ICON_COLOR_MAP: Record<string, string> = {
    "water": "#124559",
    "grass": "#606C38",
    "mountain": "#8F531D",
    "forest": "#283618",
};

type ChunkShapeProps = {
    tiles: MapTile[],
    origin: Position,
    TILE_SIZE: number
    debug: boolean
}

const ChunkShape: React.FC<ChunkShapeProps> = ({ tiles, origin, TILE_SIZE, debug }) => {
    const shapeRef = useRef<KonvaShape>(null);

    const displayTiles = (con: Context, shape: KonvaShape) => {
        for (const tile of tiles) {
            const relX = (tile.position.x - origin.x) * TILE_SIZE;
            const relY = (tile.position.y - origin.y) * TILE_SIZE;
            const iconOffset = TILE_SIZE / 2
            console.log(tile.tileType)
            con.fillStyle = BACKGROUND_COLOR_MAP[tile.tileType.toLowerCase()] ?? "#ccc"
            con.fillRect(relX, relY, TILE_SIZE, TILE_SIZE);

            con.fillStyle = ICON_COLOR_MAP[tile.tileType.toLowerCase()] ?? "#000000"

            if(debug){
                con.textAlign = "start"
                con.font = "10px Roboto Mono"

                con.fillText(`${tile.position.x};${tile.position.y}`, relX + 4, relY + 8)
            }

            if (tile.hasIcon) {
                con.textAlign = "center"
                con.textBaseline = "middle"
                con.font = "40px icons"

                con.fillText(tile.tileType.toLowerCase(), relX + iconOffset, relY + iconOffset)
            }
        }
        con.fillStrokeShape(shape);
    }

    return (
        <Shape
            ref={shapeRef}
            x={origin.x * TILE_SIZE}
            y={origin.y * TILE_SIZE}
            listening={false}
            sceneFunc={displayTiles}
        />
    );
}

export default ChunkShape;