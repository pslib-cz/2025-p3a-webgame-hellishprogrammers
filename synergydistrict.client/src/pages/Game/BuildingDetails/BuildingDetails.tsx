import { type FC } from "react";
import styles from "./BuildingDetails.module.css";
import underscore from "/src/styles/FlashingUnderscore.module.css";
import type { MapBuilding } from "../../../types/Game/Grid";
import { IconClose } from "../../../components/Icons";

type BuildingDetailsProps = {
    building: MapBuilding;
    CloseBar: () => void;
};

const BuildingDetails: FC<BuildingDetailsProps> = ({ building, CloseBar }) => {
    return (
        <div className={styles.buildingDetails}>
            <div className={styles.title}>
                <h2 className={underscore.parent}>{building.buildingType.name}</h2>
                <button onClick={() => CloseBar()}>
                    <IconClose />
                </button>
            </div>
        </div>
    );
};
export default BuildingDetails;
