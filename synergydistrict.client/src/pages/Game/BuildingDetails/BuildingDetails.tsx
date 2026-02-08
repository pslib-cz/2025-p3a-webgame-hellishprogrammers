import { useState, type FC } from "react";
import styles from "./BuildingDetails.module.css";
import underscore from "/src/styles/FlashingUnderscore.module.css";
import type { MapBuilding, ActiveSynergies } from "../../../types/Game/Grid";
import type { Production } from "../../../types/Game/Buildings";
import { IconClose, GetIcon } from "../../../components/Icons";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import useGameMapData from "../../../hooks/providers/useMapData";
import TextButton from "../../../components/Buttons/TextButton/TextButton";
import {
    AddProductionSum,
    buildPlacedBuildingsMap,
    CanAddProdution,
    DeleteProductionSum,
    GetUnaffordableProduction,
    MaterializeNaturalFeatures,
} from "../../../utils/PlacingUtils";
import useGameResources from "../../../hooks/providers/useGameResources";
import type { GameResources } from "../../../types/Game/GameResources";
import SynergyDisplay from "../../../components/Game/SynergyDisplay";
import ToggleButton from "../../../components/Buttons/ToggleButton/ToggleButton";
import { getGroupedSynergies, sumProduction } from "../../../utils/upgradeUtils";
import { useStatistics } from "../../../hooks/providers/useStatistics";
import Tooltip from "../../../components/Tooltip/Tooltip";
import { useGameData } from "../../../hooks/providers/useGameData";

type BuildingDetailsProps = {
    building: MapBuilding;
    CloseBar: () => void;
    onHighlightEdges?: (edges: ActiveSynergies[]) => void;
    isExiting?: boolean;
};

const BuildingDetails: FC<BuildingDetailsProps> = ({ building, CloseBar, onHighlightEdges, isExiting }) => {
    const { GameMapData, setGameMapData } = useGameMapData();
    const { GameResources, setGameResources } = useGameResources();
    const { setStatistics } = useStatistics();
    const { buildings, naturalFeatures, synergies: gameSynergies } = useGameData();
    const [IO, setIO] = useState<boolean>(false);

    const currentBuilding =
        GameMapData.placedBuildings.find((b) => b.MapBuildingId === building.MapBuildingId) || building;
    const currentLevel = currentBuilding.buildingType.upgrades[currentBuilding.level - 1];
    const isMaxLevel = currentBuilding.level >= currentBuilding.buildingType.upgrades.length;

    const unaffordableProduction = GetUnaffordableProduction(currentLevel.upgradeProductions, GameResources);

    const allNaturalFeatures = GameMapData.ActiveNaturalFeatures
        ? Object.values(GameMapData.ActiveNaturalFeatures)
        : [];

    const incomingSynergiesList = getGroupedSynergies(
        "incoming",
        building.MapBuildingId,
        GameMapData.activeSynergies,
        GameMapData.placedBuildings,
        allNaturalFeatures,
    );

    const outgoingSynergiesList = getGroupedSynergies(
        "outgoing",
        building.MapBuildingId,
        GameMapData.activeSynergies,
        GameMapData.placedBuildings,
        allNaturalFeatures,
    );

    const synergies = IO ? outgoingSynergiesList : incomingSynergiesList;

    const totalIncomingProduction = sumProduction(incomingSynergiesList.flatMap((group) => group.productions));

    const totalOutgoingProduction = sumProduction(outgoingSynergiesList.flatMap((group) => group.productions));

    const handleSynergyHover = (id: string) => {
        const relevantSynergies = GameMapData.activeSynergies.filter((s) => {
            if (IO) {
                return s.sourceBuildingId === building.MapBuildingId && s.targetBuildingId === id;
            } else {
                return s.sourceBuildingId === id && s.targetBuildingId === building.MapBuildingId;
            }
        });

        onHighlightEdges?.(relevantSynergies);
    };

    const handleSynergyLeave = () => {
        onHighlightEdges?.([]);
    };

    const totalLevelProduction = currentBuilding.buildingType.upgrades
        .filter((u) => currentBuilding.buildingType.upgrades.indexOf(u) < currentBuilding.level - 1)
        .flatMap((u) => u.upgradeProductions);

    const buildingProduction = sumProduction([
        ...building.buildingType.baseProduction,
        ...totalIncomingProduction,
        ...totalLevelProduction,
    ]);

    const SynergyUpgrades = () => {
        if (!currentLevel?.upgradeSynergies) return [];
        const results: { activeSynergy: ActiveSynergies; additionalStats: Production[] }[] = [];

        currentLevel.upgradeSynergies.forEach((upSyn) => {
            const myTypeId = building.buildingType.buildingId;
            const otherTypeId = upSyn.sourceBuildingId === myTypeId ? upSyn.targetBuildingId : upSyn.sourceBuildingId;

            GameMapData.activeSynergies.forEach((activeSyn) => {
                let otherInstanceId: string | null = null;
                if (activeSyn.sourceBuildingId === building.MapBuildingId) otherInstanceId = activeSyn.targetBuildingId;
                else if (activeSyn.targetBuildingId === building.MapBuildingId)
                    otherInstanceId = activeSyn.sourceBuildingId;

                if (!otherInstanceId) return;

                const otherBuilding = GameMapData.placedBuildings.find((b) => b.MapBuildingId === otherInstanceId);
                if (otherBuilding) {
                    if (otherBuilding.buildingType.buildingId === otherTypeId) {
                        results.push({ activeSynergy: activeSyn, additionalStats: upSyn.synergyProductions });
                    }
                } else {
                    const natFeature = GameMapData.ActiveNaturalFeatures?.[otherInstanceId];
                    if (natFeature) {
                        const def = naturalFeatures.find(
                            (n) => n.name.toLowerCase() === natFeature.type.toString().toLowerCase(),
                        );
                        if (def && def.synergyItemId === otherTypeId) {
                            results.push({ activeSynergy: activeSyn, additionalStats: upSyn.synergyProductions });
                        }
                    }
                }
            });
        });
        return results;
    };

    const synergyUpgradesList = SynergyUpgrades();
    const allSynergyProductions = synergyUpgradesList.flatMap((s) => s.additionalStats);

    const isDeletable = () => {
        const newResources = { ...GameResources } as GameResources;

        return (
            newResources.moneyBalance - currentLevel.deleteCost >= 0 &&
            DeleteProductionSum(building.buildingType.baseProduction, newResources) &&
            DeleteProductionSum(totalLevelProduction, newResources) &&
            DeleteProductionSum(totalIncomingProduction, newResources) &&
            DeleteProductionSum(totalOutgoingProduction, newResources)
        );
    };

    const isUpgradable = () => {
        const newResources = { ...GameResources } as GameResources;
        return (
            !isMaxLevel &&
            GameResources.moneyBalance - currentLevel.upgradeCost >= 0 &&
            AddProductionSum(currentLevel.upgradeProductions, newResources) &&
            AddProductionSum(sumProduction(allSynergyProductions), newResources)
        );
    };

    const upgradeBuilding = () => {
        if (!isUpgradable()) return;

        const newResources = { ...GameResources } as GameResources;
        newResources.moneyBalance -= currentLevel.upgradeCost;

        AddProductionSum([...currentLevel.upgradeProductions, ...allSynergyProductions], newResources);

        const newBuilding = GameMapData.placedBuildings.map((b) =>
            b.MapBuildingId === building.MapBuildingId ? { ...b, level: b.level + 1 } : b,
        );

        const newSynergies = GameMapData.activeSynergies.map((existing) => {
            const upgrade = synergyUpgradesList.find((u) => u.activeSynergy === existing);
            if (upgrade) {
                return {
                    ...existing,
                    synergyProductions: sumProduction([...existing.synergyProductions, ...upgrade.additionalStats]),
                };
            }
            return existing;
        });

        const newSynergyUpgrades = { ...(GameMapData.activeSynergyUpgrades || {}) };
        if (currentLevel.upgradeSynergies) {
            const currentUpgrades = newSynergyUpgrades[building.MapBuildingId] || [];
            newSynergyUpgrades[building.MapBuildingId] = [...currentUpgrades, ...currentLevel.upgradeSynergies];
        }

        setGameResources(newResources);
        setGameMapData((prev) => ({
            ...prev,
            placedBuildings: newBuilding,
            placedBuildingsMappped: buildPlacedBuildingsMap(newBuilding),
            activeSynergies: newSynergies,
            activeSynergyUpgrades: newSynergyUpgrades,
        }));
        setStatistics((prev) => ({
            ...prev,
            moneySpend: prev.moneySpend + currentLevel.upgradeCost,
            buildingsUpgraded: prev.buildingsUpgraded + 1,
        }));
    };

    const deleteBuilding = () => {
        if (!isDeletable()) return;

        const newResources = { ...GameResources } as GameResources;
        newResources.moneyBalance -= currentLevel.deleteCost;

        DeleteProductionSum(building.buildingType.baseProduction, newResources);
        DeleteProductionSum(totalLevelProduction, newResources);
        DeleteProductionSum(totalIncomingProduction, newResources);
        DeleteProductionSum(totalOutgoingProduction, newResources);

        const newBuildings = GameMapData.placedBuildings.filter((b) => b.MapBuildingId !== building.MapBuildingId);
        const newPlacedBuildingsMap = buildPlacedBuildingsMap(newBuildings);

        const newSynergies = GameMapData.activeSynergies.filter(
            (s) => s.sourceBuildingId !== building.MapBuildingId && s.targetBuildingId !== building.MapBuildingId,
        );

        const restoredNaturalFeaturesMap = { ...GameMapData.ActiveNaturalFeatures };

        for (let y = 0; y < building.buildingType.shape.length; y++) {
            for (let x = 0; x < building.buildingType.shape[y].length; x++) {
                if (building.buildingType.shape[y][x] !== "Empty") {
                    const tileX = building.position.x + x;
                    const tileY = building.position.y + y;
                    const tileKey = `${tileX};${tileY}`;
                    const tile = GameMapData.loadedMapTiles[tileKey];

                    if (tile && (tile.hasIcon || tile.tileType.toLowerCase() === "water")) {
                        const nfDef = naturalFeatures.find((n) => n.name.toLowerCase() === tile.tileType.toLowerCase());
                        if (!nfDef) continue;

                        const nfId = nfDef.synergyItemId;

                        const [restoredNF] = MaterializeNaturalFeatures([
                            { type: tile.tileType, position: { x: tileX, y: tileY } },
                        ]);
                        restoredNaturalFeaturesMap[restoredNF.id] = restoredNF;

                        const offsets = [
                            { dx: 0, dy: -1, side: "top" as const, opposite: "bottom" as const },
                            { dx: 1, dy: 0, side: "right" as const, opposite: "left" as const },
                            { dx: 0, dy: 1, side: "bottom" as const, opposite: "top" as const },
                            { dx: -1, dy: 0, side: "left" as const, opposite: "right" as const },
                        ];

                        for (const { dx, dy, side, opposite } of offsets) {
                            const nx = tileX + dx;
                            const ny = tileY + dy;
                            const neighborKey = `${nx};${ny}`;
                            const neighborBuilding = newPlacedBuildingsMap[neighborKey];

                            if (neighborBuilding) {
                                const nbLocalX = nx - neighborBuilding.position.x;
                                const nbLocalY = ny - neighborBuilding.position.y;

                                const connectingEdge = neighborBuilding.buildingType.edges.find(
                                    (e) =>
                                        e.position.x === nbLocalX && e.position.y === nbLocalY && e.side === opposite,
                                );

                                if (connectingEdge) {
                                    const possibleSynergies = gameSynergies.filter(
                                        (s) =>
                                            (s.sourceBuildingId === neighborBuilding.buildingType.buildingId &&
                                                s.targetBuildingId === nfId) ||
                                            (s.sourceBuildingId === nfId &&
                                                s.targetBuildingId === neighborBuilding.buildingType.buildingId),
                                    );

                                    for (const s of possibleSynergies) {
                                        const neighborUpgrades =
                                            GameMapData.activeSynergyUpgrades?.[neighborBuilding.MapBuildingId] || [];
                                        const relevantUpgrades = neighborUpgrades.filter(
                                            (us) =>
                                                us.sourceBuildingId === s.sourceBuildingId &&
                                                us.targetBuildingId === s.targetBuildingId,
                                        );
                                        const bonusProductions = relevantUpgrades.flatMap(
                                            (us) => us.synergyProductions,
                                        );
                                        const finalProduction = sumProduction([
                                            ...s.synergyProductions,
                                            ...bonusProductions,
                                        ]);

                                        AddProductionSum(finalProduction, newResources);

                                        newSynergies.push({
                                            sourceBuildingId:
                                                s.sourceBuildingId === nfId
                                                    ? restoredNF.id
                                                    : neighborBuilding.MapBuildingId,
                                            targetBuildingId:
                                                s.targetBuildingId === nfId
                                                    ? restoredNF.id
                                                    : neighborBuilding.MapBuildingId,
                                            synergyProductions: finalProduction,
                                            edge: {
                                                position: {
                                                    x: tileX - neighborBuilding.position.x,
                                                    y: tileY - neighborBuilding.position.y,
                                                },
                                                side: side,
                                            },
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        CloseBar();
        setGameResources(newResources);
        setGameMapData((prev) => ({
            ...prev,
            placedBuildings: newBuildings,
            placedBuildingsMappped: newPlacedBuildingsMap,
            activeSynergies: newSynergies,
            ActiveNaturalFeatures: restoredNaturalFeaturesMap,
        }));
        setStatistics((prev) => ({
            ...prev,
            moneySpend: prev.moneySpend + currentLevel.deleteCost,
            buildingsDemolished: prev.buildingsDemolished + 1,
        }));
    };

    return (
        <div className={`${styles.buildingDetails} ${isExiting ? styles.exit : ""}`} style={{ userSelect: "none" }}>
            <div className={styles.row}>
                <h2 className={underscore.parent}>{building.buildingType.name}</h2>
                <button onClick={() => CloseBar()} className={styles.close}>
                    <IconClose />
                </button>
            </div>
            <p className={styles.level}>Level {currentBuilding.level}</p>
            <div className={styles.infoContainer}>
                {buildingProduction.map((product) => (
                    <ShowInfo
                        gameStyle={true}
                        key={`${product.type}${product.value}`}
                        left={
                            <div className={styles.icon}>
                                {GetIcon(
                                    product.type.toLowerCase() == "energy" ? "electricity" : product.type.toLowerCase(),
                                )}
                            </div>
                        }
                        right={<>{product.value}</>}
                    />
                ))}
            </div>
            <div className={styles.row}>
                <h3>Synergy</h3>
                <div style={{ fontSize: "0.75rem" }}>
                    <ToggleButton
                        options={["incoming", "outgoing"]}
                        onChange={(x) => setIO([false, true][x])}
                        isIcons={true}
                        tooltips={[
                            <Tooltip
                                title="Incoming synergies"
                                description="Possible synergies this building can get from others"
                            />,
                            <Tooltip
                                title="Outgoing synergies"
                                description="Possible synergies this building can give to others"
                            />,
                        ]}
                    />
                </div>
            </div>
            <div className={styles.synergies}>
                {synergies.length === 0
                    ? "No synergies found"
                    : synergies.map((synergyGroup) => {
                          const name = synergyGroup.otherBuilding
                              ? synergyGroup.otherBuilding.buildingType.name
                              : synergyGroup.naturalFeature?.type || "Unknown";
                          const id = synergyGroup.otherBuilding
                              ? synergyGroup.otherBuilding.MapBuildingId
                              : synergyGroup.naturalFeature?.id || "unknown";

                          return (
                              <SynergyDisplay
                                  key={id}
                                  id={id}
                                  name={name}
                                  productions={synergyGroup.productions.map((p) => {
                                      let detlaValue = 0;
                                      return {
                                          production: p,
                                          detlaValue,
                                      };
                                  })}
                                  amount={synergyGroup.count > 1 ? synergyGroup.count : null}
                                  onMouseEnter={handleSynergyHover}
                                  onMouseLeave={handleSynergyLeave}
                              />
                          );
                      })}
            </div>
            <div className={styles.row}>
                {isMaxLevel && <h3>Max level</h3>}
                {!isMaxLevel && (
                    <>
                        <h3>Preview</h3>
                        <h3>Lvl {currentBuilding.level + 1}</h3>
                    </>
                )}
            </div>
            {!isMaxLevel && (
                <div className={styles.infoContainer}>
                    {currentLevel.upgradeProductions.map((product) => (
                        <ShowInfo
                            key={`${product.type}:${product.value}`}
                            gameStyle={true}
                            style={
                                {
                                    opacity: unaffordableProduction.has(product.type.toLowerCase()) ? ".2" : "1",
                                } as React.CSSProperties
                            }
                            left={
                                <div className={styles.icon}>
                                    {GetIcon(
                                        product.type.toLowerCase() == "energy"
                                            ? "electricity"
                                            : product.type.toLowerCase(),
                                    )}
                                </div>
                            }
                            right={<>{product.value}</>}
                        />
                    ))}
                </div>
            )}
            {!isMaxLevel &&
                currentLevel.upgradeSynergies?.map((synergy) => {
                    const myTypeId = building.buildingType.buildingId;
                    const otherTypeId =
                        synergy.sourceBuildingId === myTypeId ? synergy.targetBuildingId : synergy.sourceBuildingId;

                    const otherBuildingDef = buildings.find((b) => b.buildingId === otherTypeId);
                    const otherNatDef = naturalFeatures.find((n) => n.synergyItemId === otherTypeId);
                    const name = otherBuildingDef?.name || otherNatDef?.name || "Unknown";

                    const matchingActive = synergyUpgradesList.filter(
                        (l) => l.additionalStats === synergy.synergyProductions,
                    );
                    const count = matchingActive.length;

                    const totalSynergyProductions = sumProduction(
                        synergy.synergyProductions.map((p) => ({ ...p, value: p.value * count })),
                    );

                    const projectedProductions = totalSynergyProductions.map((p) => {
                        const resourceKey = p.type.toLowerCase() as keyof GameResources;
                        const currentValue = (GameResources as any)[resourceKey];
                        const totalCostForThisType = p.value;

                        let detlaValue = 0;
                        if (typeof currentValue === "number") {
                            if (resourceKey === "energy" && totalCostForThisType < 0) {
                                const after = GameResources.energyUsed - totalCostForThisType;
                                if (after > GameResources.energy) detlaValue = after - GameResources.energy;
                            } else if (resourceKey === "people" && totalCostForThisType < 0) {
                                const after = GameResources.peopleUsed - totalCostForThisType;
                                if (after > GameResources.people) detlaValue = after - GameResources.people;
                            } else if (totalCostForThisType < 0) {
                                if (currentValue + totalCostForThisType < 0)
                                    detlaValue = -(currentValue + totalCostForThisType);
                            }
                        }

                        return {
                            production: p,
                            detlaValue,
                        };
                    });

                    return (
                        <SynergyDisplay
                            key={`${otherTypeId}-${name}`}
                            id={otherTypeId.toString()}
                            name={name}
                            productions={projectedProductions}
                            amount={count > 0 ? count : null}
                            onMouseEnter={() => onHighlightEdges?.(matchingActive.map((m) => m.activeSynergy))}
                            onMouseLeave={handleSynergyLeave}
                        />
                    );
                })}
            <div className={styles.buttons}>
                {!isMaxLevel && (
                    <div className={styles.button} style={{ opacity: isUpgradable() ? 1 : 0.2 }}>
                        <TextButton text="upgrade" onClick={upgradeBuilding}>
                            <ValuesBox iconKey="money" text={currentLevel.upgradeCost.toString()} />
                        </TextButton>
                    </div>
                )}

                <div className={styles.button} style={{ opacity: isDeletable() ? 1 : 0.2 }}>
                    <TextButton text="demolish" onClick={deleteBuilding} sound="DELETE">
                        <ValuesBox iconKey="money" text={currentLevel.deleteCost.toString()} />
                    </TextButton>
                </div>
            </div>
        </div>
    );
};
export default BuildingDetails;
