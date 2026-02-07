import { useState, type FC } from "react";
import styles from "./BuildingDetails.module.css";
import underscore from "/src/styles/FlashingUnderscore.module.css";
import type { MapBuilding, ActiveSynergies } from "../../../types/Game/Grid";
import { IconClose, GetIcon } from "../../../components/Icons";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import useGameMapData from "../../../hooks/providers/useMapData";
import TextButton from "../../../components/Buttons/TextButton/TextButton";
import {
    AddProductionSum,
    buildPlacedBuildingsMap,
    CanAddProdution,
    CanDeleteProdution,
    DeleteProductionSum,
    GetUnaffordableProduction,
} from "../../../utils/PlacingUtils";
import useGameResources from "../../../hooks/providers/useGameResources";
import type { GameResources } from "../../../types/Game/GameResources";
import SynergyDisplay from "../../../components/Game/SynergyDisplay";
import ToggleButton from "../../../components/Buttons/ToggleButton/ToggleButton";
import { getGroupedSynergies, sumProduction } from "../../../utils/upgradeUtils";
import { useStatistics } from "../../../hooks/providers/useStatistics";
import Tooltip from "../../../components/Tooltip/Tooltip";

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
