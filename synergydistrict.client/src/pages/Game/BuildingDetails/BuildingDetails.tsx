import { type FC } from "react";
import styles from "./BuildingDetails.module.css";
import underscore from "/src/styles/FlashingUnderscore.module.css";
import type { ActiveSynergies, MapBuilding } from "../../../types/Game/Grid";
import { IconClose } from "../../../components/Icons";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import ProductionListing from "../../../components/Game/ProductionListing/ProductionListing";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import useGameMapData from "../../../hooks/providers/useMapData";

type BuildingDetailsProps = {
    building: MapBuilding;
    CloseBar: () => void;
};

const BuildingDetails: FC<BuildingDetailsProps> = ({ building, CloseBar }) => {
    const { GameMapData } = useGameMapData();
    const incomingSynergies = GameMapData.placedBuildings
        .flatMap((otherBuilding) =>
            otherBuilding.edges
                .filter((edge) => edge.synergy && edge.synergy.targetBuilding.MapBuildingId === building.MapBuildingId)
                .map((edge) => ({
                    source: otherBuilding,
                    count: otherBuilding.edges.filter(
                        (x) => x.synergy?.targetBuilding.MapBuildingId === edge.synergy?.targetBuilding.MapBuildingId,
                    ).length,
                    synergy: edge.synergy!,
                })),
        )
        .reduce(
            (accumulator, currentValue) => {
                if (!accumulator.some((x) => x.source.MapBuildingId === currentValue.source.MapBuildingId)) {
                    accumulator.push(currentValue);
                }
                return accumulator;
            },
            [] as { source: MapBuilding; synergy: ActiveSynergies; count: number }[],
        );

    return (
        <div className={styles.buildingDetails}>
            <div className={styles.title}>
                <h2 className={underscore.parent}>{building.buildingType.name}</h2>
                <button onClick={() => CloseBar()}>
                    <IconClose />
                </button>
            </div>
            <p>Level 1 (Efficiency: 120%)</p>
            <div className={styles.infoContainer}>
                {building.buildingType.baseProduction.map((product) => (
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
                {incomingSynergies.map((synergy) => (
                    <ProductionListing
                        key={synergy.synergy.activeSynergyId}
                        title={`${synergy.source.buildingType.name} ${synergy.count > 1 ? `(${synergy.count}x)` : ""}`}
                    >
                        {synergy.synergy.synergyProductions.map((product) => (
                            <ValuesBox
                                key={`${product.type}-${product.value}`}
                                iconKey={product.type.toLowerCase()}
                                text={(product.value * synergy.count).toString()}
                            />
                        ))}
                    </ProductionListing>
                ))}
            </div>
        </div>
    );
};
export default BuildingDetails;
