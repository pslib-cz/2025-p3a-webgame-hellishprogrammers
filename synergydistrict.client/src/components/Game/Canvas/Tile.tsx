import React from "react";
import { Group, Rect, Text, Line } from "react-konva";

const CELL_SIZE = 64;

const BACKGROUND_COLOR_MAP: Record<string, string> = {
  "water": "#5d8a9e",
  "grass": "#8a9e5d",
  "mountain": "#9e7b5d",
  "forest": "#8a9e5d",
  "extractional": "#1982C4",
  "industrial": "#6A4C93",
  "commercial": "#FF595E",
  "residential": "#FFCA3A",
  "recreational": "#8AC926",
};

const OUTLINE_COLOR_MAP: Record<string, string> = {
  "default": "#19191921",
  "building": "#191919",
  "selected": "#FEFAE0",
  "highlight": "#FEFAE0"
}

const ICON_COLOR_MAP: Record<string, string> = {
  "water": "#124559",
  "grass": "#606C38",
  "mountain": "#8F531D",
  "forest": "#283618",
  "building": "#FEFAE0"
};

const getBackgroundColor = (type: string): string => {
  const normalized = type?.toLowerCase() ?? "";
  return BACKGROUND_COLOR_MAP[normalized] ?? "#ccc";
};

const getIconColor = (type: string): string => {
  const normalized = type?.toLowerCase() ?? "";
  return ICON_COLOR_MAP[normalized] ?? ICON_COLOR_MAP["building"];
}

export const Tile = React.memo(({ x, y, type, iconKey, outline }: { x: number; y: number; type: string; iconKey:string; outline: string[]; }) => {
  const backgroundColor = getBackgroundColor(type);
  const color = getIconColor(type);
  const S = CELL_SIZE
  const STROKE = 1.5;

  return (
          <Group
        x={x * S}
        y={y * S}
        listening={false}
      >
        {/* Background fill */}
        <Rect
          width={S}
          height={S}
          fill={backgroundColor}
          listening={false}
        />

        {/* Top */}
        <Line
          points={[0, 0, outline[0] == "default" ? S - STROKE : S, 0]}
          stroke={OUTLINE_COLOR_MAP[outline[0]]}
          strokeWidth={STROKE}
          lineCap="square"
          listening={false}
        />

        {/* Right */}
        <Line
          points={[S, outline[1] == "default" ? 0 + STROKE : 0, S, S]}
          stroke={OUTLINE_COLOR_MAP[outline[1]]}
          strokeWidth={STROKE}
          lineCap="square"
          listening={false}
        />

        {/* Bottom */}
        <Line
          points={[0, S, outline[2] == "default" ? S - STROKE : S, S]}
          stroke={OUTLINE_COLOR_MAP[outline[2]]}
          strokeWidth={STROKE}
          lineCap="square"
          listening={false}
        />

        {/* Left */}
        <Line
          points={[0, outline[3] == "default" ? 0 + STROKE : 0, 0, S]}
          stroke={OUTLINE_COLOR_MAP[outline[3]]}
          strokeWidth={STROKE}
          lineCap="square"
          listening={false}
        />

        <Text
          text={iconKey.toLowerCase()}
          fontSize={40}
          fill={color}
          fontFamily="icons"
          x={S / 5.3333}
          y={S / 5.3333}
        />

        <Text text={`${x},${y}`} fontSize={10} fill="rgba(0,0,0,0.5)" padding={5} listening={false}/>
      </Group>
  );
});
