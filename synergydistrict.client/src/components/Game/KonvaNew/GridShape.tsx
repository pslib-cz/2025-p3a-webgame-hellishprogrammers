import { Shape } from "react-konva";
import { useCallback, useRef } from "react";
import { Context } from "konva/lib/Context";
import { Shape as KonvaShape } from "konva/lib/Shape";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import type { Position } from "../../../types/Game/Grid";

type GridShapeProps = {
    opacity: number
    pos: Position
}

const GridShape: React.FC<GridShapeProps> = ({opacity, pos}) => {
    const { TILE_SIZE, CHUNK_SIZE } = useGameProperties();

    const drawGrid = useCallback(
        (con: Context, shape: KonvaShape) => {
            con.save();

            con.strokeStyle = "#191919";
            con.globalAlpha = opacity;
            con.lineWidth = 1;

            const widthPx = CHUNK_SIZE * TILE_SIZE;
            const heightPx = CHUNK_SIZE * TILE_SIZE;

            con.beginPath();

            for (let x = 0; x <= CHUNK_SIZE - 1; x++) {
                const px = x * TILE_SIZE;
                con.moveTo(px, 0);
                con.lineTo(px, heightPx);
            }

            for (let y = 0; y <= CHUNK_SIZE - 1; y++) {
                const py = y * TILE_SIZE;
                con.moveTo(0, py);
                con.lineTo(widthPx, py);
            }

            con.stroke();
            con.restore();

            con.fillStrokeShape(shape);
        },
        [opacity]
    );
    return (
        <Shape
        x={pos.x}
        y={pos.y}
        width={CHUNK_SIZE * TILE_SIZE}
        height={CHUNK_SIZE * TILE_SIZE}
        strokeScaleEnabled={true}
        perfectDrawEnabled={false}
        sceneFunc={drawGrid}
      />
    );
}

export default GridShape;