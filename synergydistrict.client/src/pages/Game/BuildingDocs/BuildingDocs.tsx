import type { FC } from "react";
import ProductionListing from "../../../components/Game/ProductionListing/ProductionListing";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import type { BuildingType } from "../../../types/Game/Buildings";
import styles from "./BuildingDocs.module.css";

type BuildingDocsProps = {
    building: BuildingType | null;
};

const BuildingDocs: FC<BuildingDocsProps> = ({ building }) => {
    if (!building) return;

    return (
        <div className={styles.buildingDocs}>
            <div className={styles.title}>
                <h2>{building.name.toUpperCase()}_</h2>
                <span className={`${styles.icon} icon`}>{building.iconKey}</span>
            </div>
            <p>{building?.description}</p>
            <ProductionListing title="Cost">
                <ValuesBox iconKey="money" text={building.cost.toString()} />
            </ProductionListing>
            <div className={styles.infoContainer}>
            {building.baseProduction.map((product) => (
                <ShowInfo
                    gameStyle={true} 
                    key={`${product.type}${product.value}`}
                    left={
                        <div className={`${styles.icon} icon`} >
                            {product.type.toLowerCase() == "energy" ? "electricity" : product.type.toLowerCase()}
                        </div>
                    }
                    right={<>{product.value}</>}
                />
            ))}
            </div>
        </div>
    );
};
export default BuildingDocs;
