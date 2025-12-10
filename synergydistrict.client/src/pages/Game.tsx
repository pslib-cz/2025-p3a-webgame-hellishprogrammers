import React, { type ReactElement } from "react";
import { Stage, Layer } from "react-konva";
import { Tile } from "./Game/Tile";
import type { MapTile } from "../types/Grid";
import { useMap } from "../hooks/useMap";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

export default function Game() {
    const { data: grid, loading, error } = useMap();

    // We use local state for immediate zoom feedback to ensure 60FPS smoothness
    const stageRef = React.useRef<any>(null);
    const [stagePos, setStagePos] = React.useState({ x: 0, y: 0 });
    const [stageScale, setStageScale] = React.useState(1);

    const handleWheel = (e: any) => {
        e.evt.preventDefault(); // Stop browser scrolling

        const scaleBy = 1.1; // Speed of zoom
        const stage = stageRef.current;
        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition(); // Mouse position

        // Math to calculate new zoom level
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        setStageScale(newScale);
        setStagePos({
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
    };

    const getReturnContent = ():ReactElement => {
        if (loading) {
            return <div>Loading map...</div>;
        }
        else if (error) {
            return <div>Error loading map: {error}</div>;
        }
        else if (!grid) {
            return <div>No map data available.</div>;
        }
        else {
            return <Stage
                width={WIDTH}
                height={HEIGHT}
                draggable
                onWheel={handleWheel}
                scaleX={stageScale}
                scaleY={stageScale}
                x={stagePos.x}
                y={stagePos.y}
                ref={stageRef}
                // Save pan position when dragging ends
                onDragEnd={(e) => {
                    setStagePos({ x: e.target.x(), y: e.target.y() });
                }}
            >
                <Layer>
                    {grid.map((row, x) =>
                        row.map((tile, y) => {
                            const key = `${x},${y}`;
                            console.log('Rendering tile at ', key, "-> ", tile);
                            return (
                                <Tile
                                    key={key}
                                    x={x}
                                    y={y}
                                    type={tile.tileType}
                                    onClick={() => { }} // Example interaction
                                />
                            );
                        })
                    )}
                </Layer>
            </Stage>
        }
    }

    return (
        <>
            {getReturnContent()}
        </>
    );
}
