import React from "react";
import { Group, Rect, Text } from "react-konva";

const CELL_SIZE = 64;

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

const getBackgroundColor = (type: string): string => {
  const normalized = type?.toLowerCase() ?? "";
  return BACKGROUND_COLOR_MAP[normalized] ?? "#ccc";
};

const getIconColor = (type: string): string => {
  const normalized = type?.toLowerCase() ?? "";
  return ICON_COLOR_MAP[normalized] ?? "#ccc";
}

export const Tile = React.memo(({ x, y, type, hasIcon }: { x: number; y: number; type: string; hasIcon: boolean }) => {
  const backgoundColor = getBackgroundColor(type);
  const color = getIconColor(type);
  
  return (
    <Group
      x={x * CELL_SIZE}
      y={y * CELL_SIZE}
      listening={false}
    >
      <Rect
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={backgoundColor}
        stroke="#444"
        strokeWidth={1}
        listening={false}
      />

      <Text text={hasIcon ? type.toLowerCase() : ""} fontSize={40} fill={color} fontFamily="icons"/>

      <Text text={`${x},${y}`} fontSize={10} fill="rgba(0,0,0,0.5)" padding={5} listening={false}/>
    </Group>
  );
});
