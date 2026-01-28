import { type FC } from "react";
import styles from "./BuildingDetails.module.css";
import underscore from "/src/styles/FlashingUnderscore.module.css";
import type { ActiveSynergies, MapBuilding, NaturalFeature } from "../../../types/Game/Grid";
import { IconClose } from "../../../components/Icons";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import ProductionListing from "../../../components/Game/ProductionListing/ProductionListing";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import useGameMapData from "../../../hooks/providers/useMapData";
import type { Production } from "../../../types/Game/Buildings";
import TextButton from "../../../components/Buttons/TextButton/TextButton";
import { buildPlacedBuildingsMap, CanDeleteProdution, DeleteProductionSum } from "../../../utils/PlacingUtils";
import useGameResources from "../../../hooks/providers/useGameResources";
import type { GameResources } from "../../../types/Game/GameResources";
import SynergyDisplay from "../SynergyDisplay";

type BuildingDetailsProps = {
    building: MapBuilding;
    CloseBar: () => void;
};

const BuildingDetails: FC<BuildingDetailsProps> = ({ building, CloseBar }) => {
    const { GameMapData, setGameMapData } = useGameMapData();
    const { GameResources, setGameResources } = useGameResources();

    const currentBuilding = GameMapData.placedBuildings.find((b) => b.MapBuildingId === building.MapBuildingId)!;
    const isMaxLevel = currentBuilding.level >= 3;

    const DELETE_PRICE = 50 * currentBuilding.level;
    const UPGRADE_PRICE = 150 * currentBuilding.level;

    const getGroupedSynergies = (
        direction: "incoming" | "outgoing",
        currentBuildingId: string,
        allSynergies: ActiveSynergies[],
        allBuildings: MapBuilding[],
        allNaturalFeatures: NaturalFeature[],
    ) => {
        const relevantSynergies = allSynergies.filter((s) =>
            direction === "incoming"
                ? s.targetBuildingId === currentBuildingId
                : s.sourceBuildingId === currentBuildingId,
        );

        const groups = new Map<string, { count: number; productions: Production[] }>();

        relevantSynergies.forEach((syn) => {
            const otherId = direction === "incoming" ? syn.sourceBuildingId : syn.targetBuildingId;

            if (!groups.has(otherId)) {
                groups.set(otherId, { count: 0, productions: [] });
            }

            const group = groups.get(otherId)!;
            group.count += 1;

            syn.synergyProductions.forEach((prod) => {
                const existingProd = group.productions.find((p) => p.type === prod.type);
                if (existingProd) {
                    existingProd.value += prod.value;
                } else {
                    group.productions.push({ ...prod });
                }
            });
        });

        return Array.from(groups.entries())
            .map(([otherId, data]) => {
                const building = allBuildings.find((b) => b.MapBuildingId === otherId);
                const naturalFeature = allNaturalFeatures.find((nf) => nf.id === otherId);
                return {
                    otherBuilding: building,
                    naturalFeature: naturalFeature,
                    count: data.count,
                    productions: data.productions,
                };
            })
            .filter((item) => item.otherBuilding !== undefined || item.naturalFeature !== undefined) as {
            otherBuilding?: MapBuilding;
            naturalFeature?: NaturalFeature;
            count: number;
            productions: Production[];
        }[];
    };

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

    const totalIncomingProduction = incomingSynergiesList
        .flatMap((group) => group.productions)
        .reduce((acc, curr) => {
            const existing = acc.find((p) => p.type === curr.type);
            if (existing) {
                existing.value += curr.value;
            } else {
                acc.push({ ...curr });
            }
            return acc;
        }, [] as Production[]);

    const buildingProduction = building.buildingType.baseProduction.map((product) => ({ ...product })) as Production[];

    totalIncomingProduction.forEach((boost) => {
        const existing = buildingProduction.find((p) => p.type === boost.type);
        if (existing) {
            existing.value += boost.value;
        } else {
            buildingProduction.push({ ...boost });
        }
    });

    const isDeletable = () => {
        const newResources = { ...GameResources } as GameResources;
        return (
            newResources.moneyBalance - DELETE_PRICE >= 0 &&
            CanDeleteProdution(building.buildingType.baseProduction, newResources) &&
            CanDeleteProdution(totalIncomingProduction, newResources)
        );
    };

    const isUpgradable = () => {
        return GameResources.moneyBalance - UPGRADE_PRICE >= 0 && !isMaxLevel;
    };

    const upgradeBuilding = () => {
        if (!isUpgradable() || isMaxLevel) return;

        const newResources = { ...GameResources } as GameResources;
        newResources.moneyBalance -= UPGRADE_PRICE;

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
        newResources.moneyBalance -= DELETE_PRICE;

        DeleteProductionSum(building.buildingType.baseProduction, newResources);
        DeleteProductionSum(totalIncomingProduction, newResources);

        const newBuilding = GameMapData.placedBuildings.filter((b) => b.MapBuildingId !== building.MapBuildingId);
        const newSynergies = GameMapData.activeSynergies.filter(
            (s) => s.sourceBuildingId !== building.MapBuildingId && s.targetBuildingId !== building.MapBuildingId,
        );

        CloseBar();
        setGameResources(newResources);
        setGameMapData((prev) => ({
            ...prev,
            placedBuildings: newBuilding,
            placedBuildingsMappped: buildPlacedBuildingsMap(newBuilding),
            activeSynergies: newSynergies,
        }));
    };

    return (
        <div className={styles.buildingDetails} style={{userSelect: "none"}}>
            <div className={styles.row}>
                <h2 className={underscore.parent}>{building.buildingType.name}</h2>
                <button onClick={() => CloseBar()} className={styles.close}>
                    <IconClose />
                </button>
            </div>
            <p>Level {currentBuilding.level} (Efficiency: 100%)</p>
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
            <h3>Synergy</h3>
            <div className={styles.synergies}>
                {incomingSynergiesList.map((synergyGroup) => {
                    const name = synergyGroup.otherBuilding
                        ? synergyGroup.otherBuilding.buildingType.name
                        : synergyGroup.naturalFeature?.type || "Unknown";
                    const id = synergyGroup.otherBuilding
                        ? synergyGroup.otherBuilding.MapBuildingId
                        : synergyGroup.naturalFeature?.id || "unknown";

                    return (
                        <SynergyDisplay id={id} name={name} productions={synergyGroup.productions} amount={synergyGroup.count > 1 ? synergyGroup.count : null}/>
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
                    <ShowInfo
                        gameStyle={true}
                        left={<div className={`${styles.icon} icon`}>industry</div>}
                        right={<>5</>}
                    />
                    <ShowInfo
                        gameStyle={true}
                        left={<div className={`${styles.icon} icon`}>people</div>}
                        right={<>2</>}
                    />
                </div>
            )}
            <div className={styles.buttons}>
                <div className={styles.button} style={{ opacity: isUpgradable() ? 1 : 0.2 }}>
                    <TextButton text="upgrade" onClick={upgradeBuilding}>
                        <ValuesBox iconKey="money" text={UPGRADE_PRICE.toString()} />
                    </TextButton>
                </div>
                <div className={styles.button} style={{ opacity: isDeletable() ? 1 : 0.2 }}>
                    <TextButton text="demolish" onClick={deleteBuilding}>
                        <ValuesBox iconKey="money" text={DELETE_PRICE.toString()} />
                    </TextButton>
                </div>
            </div>
        </div>
    );
};
export default BuildingDetails;
