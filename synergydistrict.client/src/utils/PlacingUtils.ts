import type { BuildingTileType, TileType } from "../types";
import type {
    BuildingType,
    BuildingSynergy,
    Production,
    Edge,
    SynergyProjection,
    ProductionProjection,
} from "../types/Game/Buildings";
import type { GameResources } from "../types/Game/GameResources";
import type { MapBuilding, MapTile, Position, NaturalFeature, ActiveSynergies, EdgeSide } from "../types/Game/Grid";
import { sumProduction } from "./upgradeUtils";

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

export const CheckForNaturalFeatures = (
    shape: BuildingTileType[][],
    position: { x: number; y: number },
    loadedMapTiles: Record<string, MapTile>,
): { type: TileType; position: Position }[] => {
    const toCheckMask: Position[] = [];
    const foundFeatures: { type: TileType; position: Position }[] = [];
    for (let y = 0; y < shape.length + 2; y++) {
        for (let x = 0; x < shape[0].length + 2; x++) {
            if (
                [
                    CheckNeighboringTile({ x: x - 1, y: y - 1 }, shape),
                    CheckNeighboringTile({ x: x, y: y - 1 }, shape),
                    CheckNeighboringTile({ x: x - 1, y: y }, shape),
                    CheckNeighboringTile({ x: x, y: y }, shape),
                ].some((v) => v)
            ) {
                toCheckMask.push({ x, y });
            }
        }
    }

    for (let i = 0; i < toCheckMask.length; i++) {
        const pos = toCheckMask[i];
        const tileX = position.x + pos.x - 1;
        const tileY = position.y + pos.y - 1;
        const key = `${tileX};${tileY}`;
        const tile = loadedMapTiles[key];
        if (tile) {
            if (tile.hasIcon) {
                foundFeatures.push({ type: tile.tileType, position: { x: tileX, y: tileY } });
            }
        }
    }

    return foundFeatures;
};

export const CheckNeighboringTile = (position: Position, shape: BuildingTileType[][]): boolean => {
    if (position.y < 0 || position.x < 0 || shape.length <= position.y || shape[0].length <= position.x) {
        return false;
    }
    return shape[position.y][position.x] != "Empty";
};

export const MaterializeNaturalFeatures = (
    naturalFeatures: { type: TileType; position: Position }[],
): NaturalFeature[] => {
    const materializedFeatures: NaturalFeature[] = [];
    for (let i = 0; i < naturalFeatures.length; i++) {
        materializedFeatures.push({
            id: crypto.randomUUID(),
            position: naturalFeatures[i].position,
            type: naturalFeatures[i].type,
        });
    }
    return materializedFeatures;
};

export const CanAfford = (building: BuildingType, variables: GameResources, _placedBuildings: MapBuilding[] = []) => {
    if (building.cost > variables.moneyBalance) return false;

    if (!CanAddProdution(building.baseProduction || [], variables)) return false;
    return true;
};

type CalculateValuesResult = {
    newResources: GameResources;
    newSynergies: ActiveSynergies[];
    newNaturalFeatures: NaturalFeature[];
    removedNaturalFeatureIds: string[];
};

export const CalculateValues = (
    building: MapBuilding,
    placedBuildingsMappped: Record<string, MapBuilding>,
    naturalFeatures: { synergyItemId: number; name: string }[],
    synergies: BuildingSynergy[],
    variables: GameResources,
    loadedMapTiles: Record<string, MapTile>,
    existingNaturalFeatures?: Record<string, NaturalFeature>,
    activeSynergyUpgrades: Record<string, BuildingSynergy[]> = {},
    activeSynergies: ActiveSynergies[] = [],
): CalculateValuesResult | null => {
    const result: CalculateValuesResult = {
        newResources: { ...variables },
        newSynergies: [],
        newNaturalFeatures: [],
        removedNaturalFeatureIds: [],
    };
    const naturalFeaturesMap = new Map<string, NaturalFeature>();

    if (existingNaturalFeatures) {
        Object.values(existingNaturalFeatures).forEach((nf) => {
            const key = `${nf.position.x};${nf.position.y}`;
            naturalFeaturesMap.set(key, nf);
        });
    }

    for (let y = 0; y < building.buildingType.shape.length; y++) {
        for (let x = 0; x < building.buildingType.shape[y].length; x++) {
            if (building.buildingType.shape[y][x] !== "Empty") {
                const tileX = building.position.x + x;
                const tileY = building.position.y + y;
                const key = `${tileX};${tileY}`;

                const existingFeature = naturalFeaturesMap.get(key);
                if (existingFeature) {
                    result.removedNaturalFeatureIds.push(existingFeature.id);
                    naturalFeaturesMap.delete(key);

                    const connectedSynergies = activeSynergies.filter(
                        (s) => s.sourceBuildingId === existingFeature.id || s.targetBuildingId === existingFeature.id,
                    );

                    for (const synergy of connectedSynergies) {
                        DeleteProductionSum(synergy.synergyProductions, result.newResources);
                    }
                }
            }
        }
    }

    result.newResources.moneyBalance -= building.buildingType.cost;

    if (!AddProductionSum(building.buildingType.baseProduction || [], result.newResources)) return null;

    const possibleSynergies = synergies.filter(
        (s) =>
            s.sourceBuildingId === building.buildingType.buildingId ||
            s.targetBuildingId === building.buildingType.buildingId,
    );

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

        if (!neighbor) {
            const neighborTileKey = `${neighborPosX};${neighborPosY}`;
            const neighborTile = loadedMapTiles[neighborTileKey];

            if (
                neighborTile &&
                naturalFeatures &&
                (neighborTile.hasIcon || neighborTile.tileType.toLowerCase() === "water")
            ) {
                const naturalFeatureData = {
                    type: neighborTile.tileType,
                    position: { x: neighborPosX, y: neighborPosY },
                };
                const id = naturalFeatures.find(
                    (n) => n.name.toLowerCase() === naturalFeatureData.type.toString().toLowerCase(),
                )?.synergyItemId;

                if (id == null) continue;

                const activeSynergies = possibleSynergies.filter(
                    (s) => s.targetBuildingId === id || s.sourceBuildingId === id,
                );

                if (activeSynergies.length === 0) continue;

                for (const synergy of activeSynergies) {
                    // Check for upgrades
                    const neighborUpgrades = activeSynergyUpgrades[id.toString()] || [];
                    const relevantUpgrades = neighborUpgrades.filter(
                        (us) =>
                            us.sourceBuildingId === synergy.sourceBuildingId &&
                            us.targetBuildingId === synergy.targetBuildingId,
                    );
                    const bonusProductions = relevantUpgrades.flatMap((us) => us.synergyProductions);
                    const totalProduction = sumProduction([...synergy.synergyProductions, ...bonusProductions]);

                    if (!AddProductionSum(totalProduction || [], result.newResources)) return null;

                    const positionKey = `${neighborPosX};${neighborPosY}`;
                    let naturalFeature = naturalFeaturesMap.get(positionKey);

                    if (!naturalFeature) {
                        naturalFeature = MaterializeNaturalFeatures([naturalFeatureData])[0];
                        naturalFeaturesMap.set(positionKey, naturalFeature);
                        result.newNaturalFeatures.push(naturalFeature);
                    }

                    let target: MapBuilding;
                    let edgePosition: Position;
                    let edgeSide: EdgeSide;

                    target = building;
                    edgePosition = {
                        x: neighborPosX - building.position.x,
                        y: neighborPosY - building.position.y,
                    };
                    edgeSide = neighborEdgeSide;
                    result.newSynergies.push({
                        sourceBuildingId: naturalFeature.id,
                        targetBuildingId: target.MapBuildingId,
                        synergyProductions: totalProduction,
                        edge: { position: edgePosition, side: edgeSide },
                    });
                }
            }
            continue;
        }

        const activeSynergies = possibleSynergies.filter((s) => {
            const bId = building.buildingType.buildingId;
            const nId = neighbor.buildingType.buildingId;
            return (
                (s.sourceBuildingId === bId && s.targetBuildingId === nId) ||
                (s.sourceBuildingId === nId && s.targetBuildingId === bId)
            );
        });

        if (activeSynergies.length === 0) continue;

        for (const synergy of activeSynergies) {
            // Check for upgrades
            const neighborUpgrades = activeSynergyUpgrades[neighbor.MapBuildingId] || [];
            const relevantUpgrades = neighborUpgrades.filter(
                (us) =>
                    us.sourceBuildingId === synergy.sourceBuildingId &&
                    us.targetBuildingId === synergy.targetBuildingId,
            );
            const bonusProductions = relevantUpgrades.flatMap((us) => us.synergyProductions);
            const totalProduction = sumProduction([...synergy.synergyProductions, ...bonusProductions]);

            if (!AddProductionSum(totalProduction || [], result.newResources)) return null;

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
                synergyProductions: totalProduction,
                edge: { position: edgePosition, side: edgeSide },
            });

            if (synergy.sourceBuildingId === synergy.targetBuildingId) {
                if (!AddProductionSum(totalProduction || [], result.newResources)) return null;

                target = neighbor;
                source = building;
                edgePosition = edge.position;
                edgeSide = edge.side;

                result.newSynergies.push({
                    sourceBuildingId: source.MapBuildingId,
                    targetBuildingId: target.MapBuildingId,
                    synergyProductions: totalProduction,
                    edge: { position: edgePosition, side: edgeSide },
                });
            }
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

            if (resourceKey === "people" && product.value > 0) {
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

export const GetUnaffordableResources = (building: BuildingType, variables: GameResources): Set<string> => {
    const unaffordable = new Set<string>();

    if (building.cost > variables.moneyBalance) {
        unaffordable.add("moneyBalance");
    }

    GetUnaffordableProduction(building.baseProduction, variables).forEach((res) => unaffordable.add(res));

    return unaffordable;
};

export const GetUnaffordableProduction = (production: Production[], variables: GameResources): Set<string> => {
    const unaffordable = new Set<string>();

    for (const product of production || []) {
        const resourceKey = product.type.toLowerCase() as keyof GameResources;
        const currentValue = variables[resourceKey];

        if (typeof currentValue === "number") {
            const resultProduction = currentValue + product.value;
            if (resultProduction < 0) {
                unaffordable.add(resourceKey);
            }

            if (resourceKey === "energy" && product.value < 0) {
                if (variables.energyUsed - product.value > variables.energy) {
                    unaffordable.add("energy");
                }
            }

            if (resourceKey === "people" && product.value < 0) {
                if (variables.peopleUsed - product.value > variables.people) {
                    unaffordable.add("people");
                }
            }
        }
    }

    return unaffordable;
};

export const GetPreviewSynergies = (
    buildingType: BuildingType,
    position: Position,
    placedBuildingsMappped: Record<string, MapBuilding>,
    naturalFeatures: { synergyItemId: number; name: string }[] | undefined,
    synergies: BuildingSynergy[],
    loadedMapTiles: Record<string, MapTile>,
    variables: GameResources,
    activeSynergyUpgrades: Record<string, BuildingSynergy[]> = {},
): SynergyProjection[] => {
    // First pass: count synergies
    const synergyCounts = new Map<
        string,
        { synergy: BuildingSynergy; amount: number; totalProduction: Production[] }
    >();

    const possibleSynergies = synergies.filter(
        (s) => s.sourceBuildingId === buildingType.buildingId || s.targetBuildingId === buildingType.buildingId,
    );

    for (const edge of buildingType.edges) {
        let delX = 0;
        let delY = 0;
        switch (edge.side) {
            case "top":
                delY = -1;
                break;
            case "bottom":
                delY = 1;
                break;
            case "left":
                delX = -1;
                break;
            case "right":
                delX = 1;
                break;
        }

        const neighborPosX = position.x + edge.position.x + delX;
        const neighborPosY = position.y + edge.position.y + delY;

        const neighbor = placedBuildingsMappped[`${neighborPosX};${neighborPosY}`];

        if (!neighbor) {
            const neighborTileKey = `${neighborPosX};${neighborPosY}`;
            const neighborTile = loadedMapTiles[neighborTileKey];

            if (
                neighborTile &&
                naturalFeatures &&
                (neighborTile.hasIcon || neighborTile.tileType.toLowerCase() === "water")
            ) {
                const id = naturalFeatures.find(
                    (n) => n.name.toLowerCase() === neighborTile.tileType.toString().toLowerCase(),
                )?.synergyItemId;
                if (id == null) continue;

                const processedSynergyPairs = new Set<string>();

                for (const s of possibleSynergies) {
                    if (s.sourceBuildingId === id || s.targetBuildingId === id) {
                        const key = `${s.sourceBuildingId}-${s.targetBuildingId}`;

                        if (processedSynergyPairs.has(key)) continue;
                        processedSynergyPairs.add(key);

                        // Use helper to get potential upgrades (preview is always level 1 building)
                        // But need to know neighbor's potential upgrades. Natural features don't upgrade.
                        // New building (level 1) + Natural Feature (no level) -> No Upgrade bonus from them to us, unless we start > lvl 1? (we don't)
                        // Wait, if WE are placing a building, it starts at level 1.
                        // Does level 1 have upgrade bonuses? No, only lvl 2+.
                        // So only neighbor upgrades matter. Natural feature has no upgrades.

                        const finalProduction = s.synergyProductions;

                        if (!synergyCounts.has(key)) {
                            synergyCounts.set(key, { synergy: s, amount: 1, totalProduction: finalProduction });
                        } else {
                            const existing = synergyCounts.get(key)!;
                            existing.amount += 1;
                            existing.totalProduction = sumProduction([...existing.totalProduction, ...finalProduction]);
                        }
                    }
                }
            }
            continue;
        }

        for (const s of possibleSynergies) {
            const bId = buildingType.buildingId;
            const nId = neighbor.buildingType.buildingId;
            if (
                (s.sourceBuildingId === bId && s.targetBuildingId === nId) ||
                (s.sourceBuildingId === nId && s.targetBuildingId === bId)
            ) {
                // Determine upgrades
                // Neighbor might have upgrades affecting this synergy
                const neighborUpgrades = activeSynergyUpgrades[neighbor.MapBuildingId] || [];
                const relevantUpgrades = neighborUpgrades.filter(
                    (us) => us.sourceBuildingId === s.sourceBuildingId && us.targetBuildingId === s.targetBuildingId,
                );
                const bonusProductions = relevantUpgrades.flatMap((us) => us.synergyProductions);
                const finalProduction = sumProduction([...s.synergyProductions, ...bonusProductions]);

                const key = `${s.sourceBuildingId}-${s.targetBuildingId}`;

                const incrementAmount = s.sourceBuildingId === s.targetBuildingId ? 2 : 1;
                const productionToAdd =
                    incrementAmount === 2 ? sumProduction([...finalProduction, ...finalProduction]) : finalProduction;

                if (!synergyCounts.has(key)) {
                    synergyCounts.set(key, { synergy: s, amount: incrementAmount, totalProduction: productionToAdd });
                } else {
                    const existing = synergyCounts.get(key)!;
                    existing.amount += incrementAmount;
                    existing.totalProduction = sumProduction([...existing.totalProduction, ...productionToAdd]);
                }
            }
        }
    }

    // Second pass: compute projections with accumulated resources
    const accumulatedResources: GameResources = { ...variables };

    // Add base production to accumulated resources first
    for (const product of buildingType.baseProduction || []) {
        const resourceKey = product.type.toLowerCase() as keyof GameResources;
        const currentValue = accumulatedResources[resourceKey];

        if (typeof currentValue === "number") {
            if (resourceKey === "energy" && product.value < 0) {
                accumulatedResources.energyUsed -= product.value;
            } else if (resourceKey === "people" && product.value < 0) {
                accumulatedResources.peopleUsed -= product.value;
            } else {
                (accumulatedResources as any)[resourceKey] = currentValue + product.value;
            }
        }
    }

    const result: SynergyProjection[] = [];

    for (const { synergy: s, amount, totalProduction } of synergyCounts.values()) {
        const productionProjection: ProductionProjection[] = (totalProduction || []).map((p) => {
            const resourceKey = p.type.toLowerCase() as keyof GameResources;
            const currentValue = (accumulatedResources as any)[resourceKey];
            let detlaValue = 0;
            const totalValue = p.value; // totalProduction is already summed up for ALL edges of this type

            if (typeof currentValue === "number") {
                if (resourceKey === "energy" && totalValue < 0) {
                    const usedAfter = accumulatedResources.energyUsed - totalValue;
                    detlaValue = Math.max(0, usedAfter - accumulatedResources.energy);
                } else if (resourceKey === "people" && totalValue < 0) {
                    const usedAfter = accumulatedResources.peopleUsed - totalValue;
                    detlaValue = Math.max(0, usedAfter - accumulatedResources.people);
                } else {
                    const after = currentValue + totalValue;
                    detlaValue = after < 0 ? -after : 0;
                }

                if (resourceKey === "energy" && totalValue < 0) {
                    accumulatedResources.energyUsed -= totalValue;
                } else if (resourceKey === "people" && totalValue < 0) {
                    accumulatedResources.peopleUsed -= totalValue;
                } else {
                    (accumulatedResources as any)[resourceKey] = currentValue + totalValue;
                }
            }

            return {
                production: { ...p, value: totalValue },
                detlaValue,
            } as ProductionProjection;
        });

        result.push({
            sourceBuildingId: s.sourceBuildingId,
            targetBuildingId: s.targetBuildingId,
            productionProjection,
            amount,
        } as SynergyProjection);
    }

    return result;
};
