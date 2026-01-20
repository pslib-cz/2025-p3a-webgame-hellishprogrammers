import { type FC, useEffect, useRef } from "react";
import ProductionListing from "../../../components/Game/ProductionListing/ProductionListing";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import type { BuildingType } from "../../../types/Game/Buildings";
import styles from "./BuildingDocs.module.css";
import { useBuildingsBitmap } from "../../../hooks/providers/useBuildingsBitmap";
import EndScreen from "../EndScreen/EndScreen";



type BuildingDocsProps = {
    building: BuildingType;
};

const BuildingDocs: FC<BuildingDocsProps> = ({ building }) => {
    const {buildingsBitmap} = useBuildingsBitmap(); 
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = canvasRef.current!
        const context = canvas?.getContext("2d") 
        const bitmap = buildingsBitmap[building.buildingId]?.[0];
        context?.clearRect(0,0, canvas?.width ,canvas?.height)
        if(bitmap.height > bitmap.width){
            context?.drawImage(buildingsBitmap[building.buildingId]?.[1],0,0)
        }
        else{
            context?.drawImage(bitmap,0,0)
        }    
},[canvasRef, building]) 
    

    return (
        <div className={styles.buildingDocs}>
            <div className={styles.title}>
                <h2>{building.name.toUpperCase()}_</h2>
                <span className={`${styles.icon} icon`}>{building.iconKey}</span>
            </div>
            <p>{building.description}</p>
            <ProductionListing title="Cost">
                <ValuesBox iconKey="money" text={building.cost.toString()} />
            </ProductionListing>
            <div className={styles.infoContainer}>
                {building.baseProduction.map((product) => (
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
            <ProductionListing title="Shape">
                <canvas ref={canvasRef}>
                </canvas>
            </ProductionListing>
        </div>
    );
};
export default BuildingDocs;
