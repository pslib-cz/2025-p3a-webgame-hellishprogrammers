import type { BuildingTileType } from "../../../types";
import { type Edge, type EdgeSide, type MapBuilding, type Position } from "../../../types/Game/Grid";

const BACKGROUND_COLOR_MAP: Record<string, string> = {
  extractional: "#1982C4",
  industrial: "#6A4C93",
  commercial: "#FF595E",
  residential: "#FFCA3A",
  recreational: "#8AC926",
};

const OUTLINE_COLOR_MAP: Record<string, string> = {
  default: "#19191921",
  building: "#191919",
  selected: "#FEFAE0",
  highlight: "#FEFAE0",
};

const ICON_COLOR_MAP: Record<string, string> = {
  extractional: "#C6E6FF",
  industrial: "#D6C5F2",
  commercial: "#FFE0E1",
  residential: "#FFF2C5",
  recreational: "#D9F6C8",
  default: "#FEFAE0",
};

type OutlineKey = keyof typeof OUTLINE_COLOR_MAP;

type EdgeWithSynergy = Edge & { synergy?: unknown };

const defaultOutlines: OutlineKey[] = ["default", "default", "default", "default"];

const indexBySide: Record<EdgeSide, number> = {
  top: 0,
  right: 1,
  bottom: 2,
  left: 3,
};

const toOutline = (edge: Edge, isSelected: boolean): OutlineKey => {
  if (isSelected) {
    return "selected";
  }

  const candidate = edge as EdgeWithSynergy;
  return candidate.synergy != null ? "highlight" : "building";
};

const getTileOutline = (building: MapBuilding, position: Position): OutlineKey[] => {
  const column = building.building.shape[position.x];
  if (!column) {
    return defaultOutlines;
  }

  const tile = column[position.y];
  if (!tile || tile === "Empty") {
    return defaultOutlines;
  }

  const outlines: OutlineKey[] = [...defaultOutlines];
  const relevantEdges = building.edges.filter((edge) => edge.position.x === position.x && edge.position.y === position.y);

  for (const edge of relevantEdges) {
    const outline = toOutline(edge, building.isSelected);
    const idx = indexBySide[edge.side];
    outlines[idx] = outline;
  }

  return outlines;
};

type DrawingContext = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

type DrawEdgeParams = {
  context: DrawingContext;
  baseX: number;
  baseY: number;
  tileSize: number;
  strokeWidth: number;
  outline: OutlineKey;
  orientation: "top" | "right" | "bottom" | "left";
};

const drawEdge = ({ context, baseX, baseY, tileSize, strokeWidth, outline, orientation }: DrawEdgeParams) => {
  const color = OUTLINE_COLOR_MAP[outline] ?? OUTLINE_COLOR_MAP.default;
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.beginPath();

  switch (orientation) {
    case "top": {
      const endX = baseX + (outline === "default" ? tileSize - strokeWidth : tileSize);
      context.moveTo(baseX, baseY);
      context.lineTo(endX, baseY);
      break;
    }
    case "right": {
      const startY = baseY + (outline === "default" ? strokeWidth : 0);
      const x = baseX + tileSize;
      context.moveTo(x, startY);
      context.lineTo(x, baseY + tileSize);
      break;
    }
    case "bottom": {
      const endX = baseX + (outline === "default" ? tileSize - strokeWidth : tileSize);
      const y = baseY + tileSize;
      context.moveTo(baseX, y);
      context.lineTo(endX, y);
      break;
    }
    case "left": {
      const startY = baseY + (outline === "default" ? strokeWidth : 0);
      context.moveTo(baseX, startY);
      context.lineTo(baseX, baseY + tileSize);
      break;
    }
  }

  context.stroke();
};

type PrepareBuildingBitmapParams = {
  building: MapBuilding;
  tileSize: number;
  debug?: boolean;
};

export type PreparedBuildingBitmap = {
  img: ImageBitmap;
  width: number;
  height: number;
};

const measureShape = (shape: BuildingTileType[][]) => {
  let width = shape.length;
  let height = 0;
  for (const column of shape) {
    if (column) {
      height = Math.max(height, column.length);
    }
  }
  return { width, height };
};

const prepareBuilding = ({ building, tileSize, debug = false }: PrepareBuildingBitmapParams): PreparedBuildingBitmap | null => {
  const shape = building.building.shape;
  if (shape.length === 0) {
    return null;
  }

  const { width: tileWidth, height: tileHeight } = measureShape(shape);
  if (tileWidth === 0 || tileHeight === 0) {
    return null;
  }

  const canvasWidth = tileWidth * tileSize;
  const canvasHeight = tileHeight * tileSize;

  const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.lineCap = "square";

  const normalizedType = building.building.type.toLowerCase();
  const backgroundColor = BACKGROUND_COLOR_MAP[normalizedType] ?? "#ccc";
  const iconColor = ICON_COLOR_MAP[normalizedType] ?? ICON_COLOR_MAP.default;
  const strokeWidth = Math.max(1, (tileSize / 64) * 1.5);
  const iconFontSize = tileSize * 0.625;
  const coordFontSize = Math.max(10, tileSize * 0.16);
  const iconGlyph = building.building.iconKey ? building.building.iconKey.toLowerCase() : "";

  for (let x = 0; x < shape.length; x++) {
    const column = shape[x];
    if (!column) {
      continue;
    }

    for (let y = 0; y < column.length; y++) {
      const tile = column[y];
      if (!tile || tile === "Empty") {
        continue;
      }

      const baseX = x * tileSize;
      const baseY = y * tileSize;

      context.fillStyle = backgroundColor;
      context.fillRect(baseX, baseY, tileSize, tileSize);

      const outlines = getTileOutline(building, { x, y });
      drawEdge({ context, baseX, baseY, tileSize, strokeWidth, outline: outlines[0], orientation: "top" });
      drawEdge({ context, baseX, baseY, tileSize, strokeWidth, outline: outlines[1], orientation: "right" });
      drawEdge({ context, baseX, baseY, tileSize, strokeWidth, outline: outlines[2], orientation: "bottom" });
      drawEdge({ context, baseX, baseY, tileSize, strokeWidth, outline: outlines[3], orientation: "left" });

      if (tile === "Icon" && iconGlyph) {
        context.fillStyle = iconColor;
        context.font = `${iconFontSize}px icons`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(iconGlyph, baseX + tileSize / 2, baseY + tileSize / 2);
      }

      if (debug) {
        context.fillStyle = "rgba(0,0,0,0.5)";
        context.font = `${coordFontSize}px Roboto Mono`;
        context.textAlign = "start";
        context.textBaseline = "top";
        context.fillText(`${building.position.x + x},${building.position.y + y}`, baseX + 4, baseY + 4);
      }
    }
  }

  return {
    img: canvas.transferToImageBitmap(),
    width: canvasWidth,
    height: canvasHeight,
  };
};

export default prepareBuilding;