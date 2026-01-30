import { useState, type FC } from "react";
import styles from "./BuildingDetails.module.css";
import underscore from "/src/styles/FlashingUnderscore.module.css";
import type { ActiveSynergies, MapBuilding, NaturalFeature } from "../../../types/Game/Grid";
import { IconClose } from "../../../components/Icons";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import useGameMapData from "../../../hooks/providers/useMapData";
import type { Production } from "../../../types/Game/Buildings";
import TextButton from "../../../components/Buttons/TextButton/TextButton";
import {
    AddProductionSum,
    buildPlacedBuildingsMap,
    CanAddProdution,
    CanDeleteProdution,
    DeleteProductionSum,
} from "../../../utils/PlacingUtils";
import useGameResources from "../../../hooks/providers/useGameResources";
import type { GameResources } from "../../../types/Game/GameResources";
import SynergyDisplay from "../../../components/Game/SynergyDisplay";
import ToggleButton from "../../../components/Buttons/ToggleButton/ToggleButton";
import { getGroupedSynergies, sumProduction } from "../../../utils/upgradeUtils";

type BuildingDetailsProps = {
    building: MapBuilding;
    CloseBar: () => void;
};

const BuildingDetails: FC<BuildingDetailsProps> = ({ building, CloseBar }) => {
    const { GameMapData, setGameMapData } = useGameMapData();
    const { GameResources, setGameResources } = useGameResources();
    const [IO, setIO] = useState<boolean>(false);

    const currentBuilding = GameMapData.placedBuildings.find((b) => b.MapBuildingId === building.MapBuildingId)!;
    const currentLevel = currentBuilding.buildingType.upgrades[currentBuilding.level - 1];
    const isMaxLevel = currentBuilding.level >= currentBuilding.buildingType.upgrades.length;

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

    const totalLevelProduction = currentBuilding.buildingType.upgrades
        .filter((u) => currentBuilding.buildingType.upgrades.indexOf(u) < currentBuilding.level - 1)
        .flatMap((u) => u.upgradeProductions);

    const buildingProduction = sumProduction([
        ...building.buildingType.baseProduction,
        ...totalIncomingProduction,
        ...totalLevelProduction,
    ]);

    const isDeletable = () => {
        const newResources = { ...GameResources } as GameResources;
        return (
            newResources.moneyBalance - currentLevel.deleteCost >= 0 &&
            CanDeleteProdution(building.buildingType.baseProduction, newResources) &&
            CanDeleteProdution(totalLevelProduction, newResources) &&
            CanDeleteProdution(totalIncomingProduction, newResources) &&
            CanDeleteProdution(totalOutgoingProduction, newResources)
        );
    };

    const isUpgradable = () => {
        const newResources = { ...GameResources } as GameResources;
        return (
            !isMaxLevel &&
            GameResources.moneyBalance - currentLevel.upgradeCost >= 0 &&
            CanAddProdution(currentLevel.upgradeProductions, newResources)
        );
    };

    const upgradeBuilding = () => {
        if (!isUpgradable()) return;

        const newResources = { ...GameResources } as GameResources;
        newResources.moneyBalance -= currentLevel.upgradeCost;

        AddProductionSum(currentLevel.upgradeProductions, newResources);

        const newBuilding = GameMapData.placedBuildings.map((b) =>
            b.MapBuildingId === building.MapBuildingId ? { ...b, level: b.level + 1 } : b,
        );

        setGameResources(newResources);
        setGameMapData((prev) => ({
            ...prev,
            placedBuildings: newBuilding,
            placedBuildingsMappped: buildPlacedBuildingsMap(newBuilding),
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
        const newSynergies = GameMapData.activeSynergies.filter(
            (s) => s.sourceBuildingId !== building.MapBuildingId && s.targetBuildingId !== building.MapBuildingId,
        );

        CloseBar();
        setGameResources(newResources);
        setGameMapData((prev) => ({
            ...prev,
            placedBuildings: newBuildings,
            placedBuildingsMappped: buildPlacedBuildingsMap(newBuildings),
            activeSynergies: newSynergies,
        }));
    };

    return (
        <div className={styles.buildingDetails} style={{ userSelect: "none" }}>
            <div className={styles.row}>
                <h2 className={underscore.parent}>{building.buildingType.name}</h2>
                <button onClick={() => CloseBar()} className={styles.close}>
                    <IconClose />
                </button>
            </div>
            <p>
                Level {currentBuilding.level} (Efficiency: {currentBuilding.level * 100}%)
            </p>
            <div className={styles.infoContainer}>
                {buildingProduction.map((product) => (
                    <ShowInfo
                        gameStyle={true}
                        key={`${product.type}${product.value}`}
                        left={
                            <div className={`${styles.icon} icon`}>
                                {product.type.toLowerCase() == "energy" ? "electricity" : product.type.toLowerCase()}
                            </div>
                        }
                        right={<>{product.value}</>}
                    />
                ))}
            </div>
            <div className={styles.row}>
                <h3>Synergy</h3>
                <div style={{ fontSize: "0.75rem" }}>
                    <ToggleButton options={["I", "O"]} onChange={() => setIO((io) => !io)} />
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
                                    id={id}
                                    name={name}
                                    productions={synergyGroup.productions.map((p) => {
                                        let detlaValue = 0;
                                        const resourceKey = p.type.toLowerCase() as keyof GameResources;
                                        const currentValue = (GameResources as any)[resourceKey];
                                        if (typeof currentValue === "number") {
                                            if (resourceKey === "energy" && p.value < 0) {
                                                const usedAfter = GameResources.energyUsed - p.value;
                                                detlaValue = Math.max(0, usedAfter - GameResources.energy);
                                            } else if (resourceKey === "people" && p.value < 0) {
                                                const usedAfter = GameResources.peopleUsed - p.value;
                                                detlaValue = Math.max(0, usedAfter - GameResources.people);
                                            } else {
                                                const after = currentValue + p.value;
                                                detlaValue = after < 0 ? -after : 0;
                                            }
                                        }

                                        return {
                                            production: p,
                                            detlaValue,
                                        };
                                    })}
                                    amount={synergyGroup.count > 1 ? synergyGroup.count : null}
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
                            left={
                                <div className={`${styles.icon} icon`}>
                                    {product.type.toLowerCase() == "energy"
                                        ? "electricity"
                                        : product.type.toLowerCase()}
                                </div>
                            }
                            right={<>{product.value}</>}
                        />
                    ))}
                </div>
            )}
            <div className={styles.buttons}>
                {!isMaxLevel && (
                    <div className={styles.button} style={{ opacity: isUpgradable() ? 1 : 0.2 }}>
                        <TextButton text="upgrade" onClick={upgradeBuilding}>
                            <ValuesBox iconKey="money" text={currentLevel.upgradeCost.toString()} />
                        </TextButton>
                    </div>
                )}

                <div className={styles.button} style={{ opacity: isDeletable() ? 1 : 0.2 }}>
                    <TextButton text="demolish" onClick={deleteBuilding}>
                        <ValuesBox iconKey="money" text={currentLevel.deleteCost.toString()} />
                    </TextButton>
                </div>
            </div>
        </div>
    );
};
export default BuildingDetails;
