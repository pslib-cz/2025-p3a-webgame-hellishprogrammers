import { useCallback, useState, type RefObject } from "react";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Position } from "../types/Game/Grid";

type UseStageTransformOptions = {
    stageRef: RefObject<Konva.Stage | null>;
    scaleBy: number;
    minScale: number;
    maxScale: number;
    initialScale?: number;
    initialPosition?: Position;
};

type UseStageTransformResult = {
    stageScale: number;
    stagePosition: Position;
    setStageScale: (scale: number) => void;
    setStagePosition: (position: Position) => void;
    handleWheel: (event: KonvaEventObject<WheelEvent>) => void;
    handleDragEnd: () => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(value, min));

const useStageTransform = ({
    stageRef,
    scaleBy,
    minScale,
    maxScale,
    initialScale = 1,
    initialPosition = { x: 0, y: 0 },
}: UseStageTransformOptions): UseStageTransformResult => {
    const [stageScale, setStageScale] = useState(initialScale);
    const [stagePosition, setStagePosition] = useState<Position>(initialPosition);

    const handleWheel = useCallback(
        (event: KonvaEventObject<WheelEvent>) => {
            event.evt.preventDefault();

            const stage = stageRef.current;
            if (!stage) return;

            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            const direction = event.evt.deltaY > 0 ? -1 : 1;
            const zoomFactor = direction > 0 ? scaleBy : 1 / scaleBy;
            const oldScale = stageScale;
            const nextScale = clamp(oldScale * zoomFactor, minScale, maxScale);
            if (nextScale === oldScale) return;

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            const newPosition = {
                x: pointer.x - mousePointTo.x * nextScale,
                y: pointer.y - mousePointTo.y * nextScale,
            };

            setStageScale(nextScale);
            setStagePosition(newPosition);
        },
        [stageRef, scaleBy, minScale, maxScale, stageScale],
    );

    const handleDragEnd = useCallback(() => {
        const stage = stageRef.current;
        if (!stage) return;

        const pos = stage.position();
        setStagePosition(pos);
    }, [stageRef]);

    return {
        stageScale,
        stagePosition,
        setStageScale,
        setStagePosition,
        handleWheel,
        handleDragEnd,
    };
};

export default useStageTransform;
