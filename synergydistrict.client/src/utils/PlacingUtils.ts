import type { BuildingTileType } from "../types";
import type { BuildingSynergy, Production } from "../types/Game/Buildings";
import type { GameVariablesValue } from "../types/Game/GameVariables";
// import type { BuildingType } from "../types/Game/Buildings";
import type { Edge, EdgeSide, MapBuilding, MapTile } from "../types/Game/Grid";

export const CanPlaceBuilding = (
    shape: BuildingTileType[][],
    position: { x: number; y: number },
    placedBuildingsMappped: Record<string, MapBuilding>,
    loadedMapTiles: Record<string, MapTile>
): boolean => {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] != "Empty") {
                const tileX = position.x + x;
                const tileY = position.y + y;
                const key = `${tileX};${tileY}`;
                if (placedBuildingsMappped[key]) {
                    const building = placedBuildingsMappped[key];
                    const otherX = tileX - building.position.x;
                    const otherY = tileY - building.position.y;
                    if (building.shape[otherY][otherX] != "Empty") {
                        return false; // Kolize s další budovou (velký špatný)
                    }
                }
                if (!loadedMapTiles[key]) {
                    return false; // Pokus o umístění mimo načtené chunky (idk asi error možná spravit?)
                }
                const tileType = loadedMapTiles[key].tileType.toLowerCase();
                if (tileType == "water" || tileType == "mountain") {
                    return false;
                }
            }
        }
    }
    return true;
};

export const CalculateValues = (
    building: MapBuilding,
    placedBuildingsMappped: Record<string, MapBuilding>,
    synergies: BuildingSynergy[],
    variables: GameVariablesValue
): GameVariablesValue | null => {
    const result: GameVariablesValue = { ...variables };
    // Checking price is less or equal balance
    if (building.buildingType.cost > variables.moneyBalance) return null;

    result.moneyBalance -= building.buildingType.cost;

    // Checking if final production is possitive or null
    if (!AddProductionSum(building.buildingType.baseProduction || [], result)) return null;

    // Checking synergies production
    for (const edge of building.edges) {
        let delX = 0;
        let delY = 0;
        let side: EdgeSide;
        switch (edge.side) {
            case "top":
                delY = -1;
                side = "bottom";
                break;
            case "bottom":
                delY = 1;
                side = "top";
                break;
            case "left":
                delX = -1;
                side = "right";
                break;
            case "right":
                delX = 1;
                side = "left";
                break;
        }

        const neighborKey = `${building.position.x + edge.position.x + delX};${
            building.position.y + edge.position.y + delY
        }`;
        const neighbor = placedBuildingsMappped[neighborKey];

        if (neighbor) {
            const activeSynergies = synergies.filter(
                (s) =>
                    (s.sourceBuildingId === building.buildingType.buildingId &&
                        s.targetBuildingId === neighbor.buildingType.buildingId) ||
                    (s.sourceBuildingId === neighbor.buildingType.buildingId &&
                        s.targetBuildingId === building.buildingType.buildingId)
            );

            if (activeSynergies.length === 0) continue;

            for (const synergy of activeSynergies) {
                if (!AddProductionSum(synergy.synergyProduction || [], result)) return null;
            }
        }
    }
    return result;
};

const AddProductionSum = (products: Production[], variables: GameVariablesValue): boolean => {
    for (const product of products) {
        const resourceKey = product.type.toLowerCase() as keyof GameVariablesValue;
        const currentValue = variables[resourceKey];

        if (typeof currentValue === "number") {
            const resultProduction = currentValue + product.value;
            if (resultProduction < 0) return false;

            if (resourceKey === "energy" && product.value < 0) {
                if (variables.energyUsed - product.value > variables.energy) return false;

                variables.energyUsed -= product.value;
                continue;
            }

            if (resourceKey === "people" && product.value < 0) {
                if (variables.peopleUsed - product.value > variables.people) return false;

                variables.peopleUsed -= product.value;
                continue;
            }

            (variables as any)[resourceKey] = resultProduction;
        }
    }
    return true;
};

export const createEgdesForShape = (shape: BuildingTileType[][]): Edge[] => {
    const edges: Edge[] = [];

    if (shape.length === 0) {
        return edges;
    }

    const offsets: { dx: number; dy: number; side: Edge["side"] }[] = [
        { dx: 0, dy: -1, side: "top" },
        { dx: 1, dy: 0, side: "right" },
        { dx: 0, dy: 1, side: "bottom" },
        { dx: -1, dy: 0, side: "left" },
    ];

    for (let y = 0; y < shape.length; y++) {
        const row = shape[y];
        for (let x = 0; x < row.length; x++) {
            if (row[x] === "Empty") {
                continue;
            }

            for (const { dx, dy, side } of offsets) {
                const neighborY = y + dy;
                const neighborX = x + dx;
                const neighborRow = shape[neighborY];
                const neighborTile = neighborRow ? neighborRow[neighborX] : undefined;

                if (!neighborTile || neighborTile === "Empty") {
                    edges.push({
                        position: { x, y },
                        side,
                        synergy: null,
                    });
                }
            }
        }
    }

    return edges;
};

export const rotateShape = (shape: BuildingTileType[][], rotation: number): BuildingTileType[][] => {
    if (shape.length === 0) {
        return [];
    }
    let currentShape = shape.map((row) => [...row]);

    const rotateClockwise = (matrix: BuildingTileType[][]): BuildingTileType[][] => {
        if (matrix.length === 0 || matrix[0].length === 0) {
            return [];
        }

        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated: BuildingTileType[][] = Array.from({ length: cols }, () => Array(rows) as BuildingTileType[]);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                rotated[x][rows - 1 - y] = matrix[y][x];
            }
        }

        return rotated;
    };

    for (let i = 0; i < rotation; i++) {
        currentShape = rotateClockwise(currentShape);
    }

    return currentShape;
};
