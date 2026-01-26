import type { BuildingTileType } from "../types";
import type { BuildingSynergy, BuildingType, Edge, Production } from "../types/Game/Buildings";
import type { GameResources } from "../types/Game/GameResources";
import type { ActiveSynergies, EdgeSide, MapBuilding, MapTile, Position } from "../types/Game/Grid";

export const CanPlaceBuilding = (
    shape: BuildingTileType[][],
    position: { x: number; y: number },
    placedBuildingsMappped: Record<string, MapBuilding>,
    loadedMapTiles: Record<string, MapTile>,
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
                    if (building.buildingType.shape[otherY][otherX] != "Empty") {
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

export const CanAfford = (building: BuildingType, variables: GameResources) => {
    // Checking price is less or equal balance
    if (building.cost > variables.moneyBalance) return false;

    // Checking if final production is possitive or null
    if (!CanAddProdution(building.baseProduction || [], variables)) return false;
    return true;
};

type CalculateValuesResult = {
    newResources: GameResources;
    newSynergies: ActiveSynergies[];
};

export const CalculateValues = (
    building: MapBuilding,
    placedBuildingsMappped: Record<string, MapBuilding>,
    synergies: BuildingSynergy[],
    variables: GameResources,
): CalculateValuesResult | null => {
    const result: CalculateValuesResult = { newResources: { ...variables }, newSynergies: [] };

    result.newResources.moneyBalance -= building.buildingType.cost;

    if (!AddProductionSum(building.buildingType.baseProduction || [], result.newResources)) return null;

    // Checking synergies production
    for (const edge of building.buildingType.edges) {
        let delX = 0;
        let delY = 0;
        let neighborEdgeSide: EdgeSide;
        switch (edge.side) {
            case "top":
                delY = -1;
                neighborEdgeSide = "bottom";
                break;
            case "bottom":
                delY = 1;
                neighborEdgeSide = "top";
                break;
            case "left":
                delX = -1;
                neighborEdgeSide = "right";
                break;
            case "right":
                delX = 1;
                neighborEdgeSide = "left";
                break;
        }

        const neighborPosX = building.position.x + edge.position.x + delX;
        const neighborPosY = building.position.y + edge.position.y + delY;

        const neighbor = placedBuildingsMappped[`${neighborPosX};${neighborPosY}`];

        if (!neighbor) continue;

        const activeSynergies = synergies.filter(
            (s) =>
                (s.sourceBuildingId === building.buildingType.buildingId &&
                    s.targetBuildingId === neighbor.buildingType.buildingId) ||
                (s.sourceBuildingId === neighbor.buildingType.buildingId &&
                    s.targetBuildingId === building.buildingType.buildingId),
        );

        if (activeSynergies.length === 0) continue;

        for (const synergy of activeSynergies) {
            if (!AddProductionSum(synergy.synergyProductions || [], result.newResources)) return null;

            let target: MapBuilding;
            let source: MapBuilding;
            let edgePosition: Position;
            let edgeSide: EdgeSide;

            if (synergy.targetBuildingId === building.buildingType.buildingId) {
                target = building;
                source = neighbor;
                edgePosition = {
                    x: neighborPosX - neighbor.position.x,
                    y: neighborPosY - neighbor.position.y,
                };
                edgeSide = neighborEdgeSide;
            } else {
                target = neighbor;
                source = building;
                edgePosition = edge.position;
                edgeSide = edge.side;
            }

            result.newSynergies.push({
                sourceBuildingId: source.MapBuildingId,
                targetBuildingId: target.MapBuildingId,
                synergyProductions: synergy.synergyProductions,
                edge: { position: edgePosition, side: edgeSide },
            });
        }
    }
    return result;
};

export const CanAddProdution = (products: Production[], variables: GameResources) => {
    for (const product of products) {
        const resourceKey = product.type.toLowerCase() as keyof GameResources;
        const currentValue = variables[resourceKey];

        if (typeof currentValue === "number") {
            const resultProduction = currentValue + product.value;
            if (resultProduction < 0) return false;

            if (resourceKey === "energy" && product.value < 0) {
                if (variables.energyUsed - product.value > variables.energy) return false;
                continue;
            }

            if (resourceKey === "people" && product.value < 0) {
                if (variables.peopleUsed - product.value > variables.people) return false;
                continue;
            }
        }
    }
    return true;
};

export const AddProductionSum = (products: Production[], variables: GameResources): boolean => {
    if (!CanAddProdution(products, variables)) return false;
    for (const product of products) {
        const resourceKey = product.type.toLowerCase() as keyof GameResources;
        const currentValue = variables[resourceKey];

        if (typeof currentValue === "number") {
            const resultProduction = currentValue + product.value;

            if (resourceKey === "energy" && product.value < 0) {
                variables.energyUsed -= product.value;
                continue;
            }

            if (resourceKey === "people" && product.value < 0) {
                variables.peopleUsed -= product.value;
                continue;
            }

            (variables as any)[resourceKey] = resultProduction;
        }
    }
    return true;
};

export const CanDeleteProdution = (products: Production[], variables: GameResources) => {
    for (const product of products) {
        const resourceKey = product.type.toLowerCase() as keyof GameResources;
        const currentValue = variables[resourceKey];

        if (typeof currentValue === "number") {
            const resultProduction = currentValue - product.value;
            if (resultProduction < 0) return false;

            if (resourceKey === "energy" && product.value > 0) {
                if (variables.energy - product.value < variables.energyUsed) return false;
                continue;
            }

            if (resourceKey === "people" && product.value < 0) {
                if (variables.people - product.value < variables.peopleUsed) return false;
                continue;
            }
        }
    }
    return true;
};

export const DeleteProductionSum = (products: Production[], variables: GameResources): boolean => {
    if (!CanDeleteProdution(products, variables)) return false;
    for (const product of products) {
        const resourceKey = product.type.toLowerCase() as keyof GameResources;
        const currentValue = variables[resourceKey];

        if (typeof currentValue === "number") {
            const resultProduction = currentValue - product.value;

            if (resourceKey === "energy" && product.value < 0) {
                variables.energyUsed += product.value;
                continue;
            }

            if (resourceKey === "people" && product.value < 0) {
                variables.peopleUsed += product.value;
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

export const buildPlacedBuildingsMap = (buildings: MapBuilding[]): Record<string, MapBuilding> => {
    const mapped: Record<string, MapBuilding> = {};

    for (const building of buildings) {
        for (let y = 0; y < building.buildingType.shape.length; y++) {
            const row = building.buildingType.shape[y];
            for (let x = 0; x < row.length; x++) {
                if (row[x] === "Empty") continue;
                const key = `${building.position.x + x};${building.position.y + y}`;
                mapped[key] = building;
            }
        }
    }

    return mapped;
};
