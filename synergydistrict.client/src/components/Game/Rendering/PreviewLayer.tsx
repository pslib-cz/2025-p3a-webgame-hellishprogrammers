import { Layer, Image, Rect } from "react-konva";
import type { MapBuilding, Position } from "../../../types/Game/Grid";
import { useBuildingsBitmap } from "../../../hooks/providers/useBuildingsBitmap";
import { useImageBitmap } from "../../../hooks/useImage";
import useGameProperties from "../../../hooks/providers/useGameProperties";

type PreviewLayerProps = {
    previewBuilding: MapBuilding | null;
    position: Position | null;
    isPlaceable: boolean;
};

const PreviewLayer: React.FC<PreviewLayerProps> = ({ previewBuilding, position, isPlaceable }) => {
    const bitmaps = useBuildingsBitmap();
    const fallback = useImageBitmap("/images/err.jpg");
    const { TILE_SIZE } = useGameProperties();

    if (!previewBuilding || !position) {
        return null;
    }

    const shapeWidth = previewBuilding.buildingType.shape[0]?.length ?? 0;
    const shapeHeight = previewBuilding.buildingType.shape.length;

    if (shapeWidth === 0 || shapeHeight === 0) {
        return null;
    }

    const previewImage = bitmaps.buildingsBitmap[previewBuilding.buildingType.buildingId]?.[previewBuilding.rotation];
    const imageSource = previewImage ?? fallback.bitmap;

    if (!imageSource) {
        return null;
    }

    const widthPx = shapeWidth * TILE_SIZE;
    const heightPx = shapeHeight * TILE_SIZE;
    const xPx = position.x * TILE_SIZE;
    const yPx = position.y * TILE_SIZE;

    const occupiedTiles = previewBuilding.buildingType.shape.reduce<{ x: number; y: number; key: string }[]>(
        (acc, row, rowIdx) => {
            row.forEach((tile, colIdx) => {
                if (tile !== "Empty") {
                    acc.push({ x: colIdx, y: rowIdx, key: `${rowIdx}-${colIdx}` });
                }
            });
            return acc;
        },
        [],
    );

    return (
        <>
            <Layer listening={false}>
                <Image
                    x={xPx}
                    y={yPx}
                    width={widthPx}
                    height={heightPx}
                    image={imageSource}
                    opacity={isPlaceable ? 0.55 : 0.2}
                    listening={false}
                />
                {!isPlaceable &&
                    occupiedTiles.map((tile) => (
                        <Rect
                            key={tile.key}
                            x={xPx + tile.x * TILE_SIZE}
                            y={yPx + tile.y * TILE_SIZE}
                            width={TILE_SIZE}
                            height={TILE_SIZE}
                            fill="rgba(220, 38, 38, 0.45)"
                            listening={false}
                        />
                    ))}
            </Layer>
        </>
    );
};

export default PreviewLayer;
