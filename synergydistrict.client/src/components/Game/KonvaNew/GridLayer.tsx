import { useRef, useEffect, useCallback } from "react";
import type { Shape as KonvaShape } from "konva/lib/Shape";
import type { Context } from "konva/lib/Context";
import { Layer, Shape } from "react-konva";

type GridLayerProp = {
    TILE_SIZE: number
    mapWidthTiles: number;
    mapHeightTiles: number;
    opacity: number;
}

const GridLayer: React.FC<GridLayerProp> = ({ TILE_SIZE, mapHeightTiles, mapWidthTiles, opacity }) => {
    const shapeRef = useRef<KonvaShape>(null);

    const drawGrid = useCallback(
        (con: Context, shape: KonvaShape) => {
            con.save();

            con.strokeStyle = "#191919";
            con.globalAlpha = opacity;
            con.lineWidth = 1;

            const widthPx = mapWidthTiles * TILE_SIZE;
            const heightPx = mapHeightTiles * TILE_SIZE;

            con.beginPath();

            // Vertical lines
            for (let x = 0; x <= mapWidthTiles; x++) {
                const px = x * TILE_SIZE;
                con.moveTo(px, 0);
                con.lineTo(px, heightPx);
            }

            // Horizontal lines
            for (let y = 0; y <= mapHeightTiles; y++) {
                const py = y * TILE_SIZE;
                con.moveTo(0, py);
                con.lineTo(widthPx, py);
            }

            con.stroke();
            con.restore();

            con.fillStrokeShape(shape);
        },
        [mapWidthTiles, mapHeightTiles, TILE_SIZE, opacity]
    );

    useEffect(() => {
        const node = shapeRef.current as any;
        if (!node) return;

        node.clearCache();
        node.cache({ pixelRatio: window.devicePixelRatio || 1 });
        node.drawHitFromCache?.();
    }, [mapWidthTiles, mapHeightTiles, TILE_SIZE]);

    return (
    <Layer listening={false}>
      <Shape
        ref={shapeRef as any}
        width={mapWidthTiles * TILE_SIZE}
        height={mapHeightTiles * TILE_SIZE}
        strokeScaleEnabled={false} // keep line thickness constant on zoom
        perfectDrawEnabled={false}
        sceneFunc={drawGrid}
      />
    </Layer>
  );
};

export default GridLayer