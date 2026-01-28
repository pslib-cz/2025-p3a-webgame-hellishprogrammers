import { type FC, useEffect, useRef, useState } from "react";
import ProductionListing from "../../../components/Game/ProductionListing/ProductionListing";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import type { BuildingType } from "../../../types/Game/Buildings";
import styles from "./BuildingDocs.module.css";
import { useBuildingsBitmap } from "../../../hooks/providers/useBuildingsBitmap";
import TextButton from "../../../components/Buttons/TextButton/TextButton";
import type { BuildingCategory } from "../../../types/";
import ToggleButton from "../../../components/Buttons/ToggleButton/ToggleButton";
import { useGameData } from "../../../hooks/providers/useGameData";
import SynergyDisplay from "../SynergyDisplay";

const buildingCategories: BuildingCategory[] = ["Residential", "Commercial", "Industrial", "Extractional", "Recreational"];

type BuildingDocsProps = {
    building: BuildingType;
};

const BuildingDocs: FC<BuildingDocsProps> = ({ building }) => {
    const { buildingsBitmap } = useBuildingsBitmap();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<BuildingCategory>("Residential");
    const { synergies, buildings } = useGameData()
    const [IO,setIO] = useState<boolean>(false)
    useEffect(() => {
        const canvas = canvasRef.current!;
        const context = canvas?.getContext("2d");
        const bitmap = buildingsBitmap[building.buildingId]?.[0];
        context?.clearRect(0, 0, canvas?.width, canvas?.height);
        if (bitmap.height > bitmap.width) {
            context?.drawImage(
                buildingsBitmap[building.buildingId]?.[1],
                (canvas.width - bitmap.height) / 2,
                (canvas.height - bitmap.width) / 2,
            );
        } else {
            context?.drawImage(bitmap, (canvas.width - bitmap.width) / 2, (canvas.height - bitmap.height) / 2);
        }
    }, [canvasRef, building]);

    return (
        <div className={styles.buildingDocs} style={{userSelect: "none"}}>
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
                <canvas ref={canvasRef} style={{ width: "100%" }} />
            </ProductionListing>
            <div style={{display: "flex", flexDirection: "column", gap: ".5rem"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <h2 className={styles.title}>Synergy</h2>
                    <div style={{ fontSize: "0.75rem"}}>
                        <ToggleButton options={["I","O"]} onChange={() => setIO(io => !io)}/>
                    </div>
                </div>

                <div style={{display: "flex", flexDirection: "column"}}>
                    {
                        buildingCategories.map((category) => (
                            <TextButton key={category} isActive={selectedCategory === category} text={category} bacgroundColor={`--${category.toLowerCase()}`} textAlign="left" onClick={() => setSelectedCategory(category)}></TextButton>
                        ))
                    }
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: ".5rem"}}>
                    {
                        synergies.filter(s => 
                        {
                            const other = buildings.find(b => b.buildingId == (!IO ? s.sourceBuildingId : s.targetBuildingId))
                            if(!IO){
                                return s.targetBuildingId == building.buildingId && other?.type == selectedCategory
                            }
                            else
                            {
                                return s.sourceBuildingId == building.buildingId && other?.type == selectedCategory
                            }
                        }).map(s => 
                            { 
                                const other = buildings.find(b => b.buildingId == (!IO ? s.sourceBuildingId : s.targetBuildingId))
                                if(!other) return;
                                return <SynergyDisplay id={!IO ? s.sourceBuildingId.toString() : s.targetBuildingId.toString()} name={other?.name} amount={null} productions={s.synergyProductions}/> 
                            } 
                        )
                    }
                </div>
            </div>
        </div>
    );
};
export default BuildingDocs;
