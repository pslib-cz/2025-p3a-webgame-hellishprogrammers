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
import useGameResources from "../../../hooks/providers/useGameResources";
import { GetUnaffordableResources } from "../../../utils/PlacingUtils";
import SynergyDisplay from "../../../components/Game/SynergyDisplay";

const buildingCategories: BuildingCategory[] = [
    "Residential",
    "Commercial",
    "Industrial",
    "Extractional",
    "Recreational",
];

type BuildingDocsProps = {
    building: BuildingType;
};

const BuildingDocs: FC<BuildingDocsProps> = ({ building }) => {
    const { buildingsBitmap } = useBuildingsBitmap();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<BuildingCategory | "NaturalFeatures">("Residential");
    const { synergies, buildings, naturalFeatures } = useGameData();
    const { GameResources } = useGameResources();
    const unaffordableResources = GetUnaffordableResources(building, GameResources);
    const [IO, setIO] = useState<boolean>(false)

    const possibleSynergies = synergies
        .filter((s) => {
            if (IO) {
                return s.sourceBuildingId == building.buildingId;
            }
            else {
                return s.targetBuildingId == building.buildingId;
            }
        })

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
        <div className={styles.buildingDocs} style={{ userSelect: "none" }}>
            <div className={styles.title}>
                <h2>{building.name.toUpperCase()}_</h2>
                <span className={`${styles.icon} icon`}>{building.iconKey}</span>
            </div>
            <p>{building.description}</p>
            <ProductionListing title="Cost" style={{ opacity: unaffordableResources.has("money") ? ".2" : "1" } as React.CSSProperties}>
                <ValuesBox
                    iconKey="money"
                    text={building.cost.toString()}
                />
            </ProductionListing>
            <div className={styles.infoContainer}>
                {building.baseProduction.map((product) => (
                    <ShowInfo
                        gameStyle={true}
                        key={`${product.type}${product.value}`}
                        style={{ opacity: unaffordableResources.has(product.type.toLowerCase()) ? ".2" : "1" } as React.CSSProperties}
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
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 className={styles.title}>Synergy</h2>
                    <div style={{ fontSize: "0.75rem" }}>
                        <ToggleButton options={["I", "O"]} onChange={() => setIO((io) => !io)} />
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    {buildingCategories.filter(c => {
                        return possibleSynergies.some(s => {
                            const other = buildings.find(
                                (b) => b.buildingId == (!IO ? s.sourceBuildingId : s.targetBuildingId),
                            );
                            return other?.type.toLowerCase() == c.toLowerCase();
                        })
                    }
                    ).map((category) => (
                        <TextButton
                            key={category}
                            isActive={selectedCategory === category}
                            text={category}
                            bacgroundColor={`--${category.toLowerCase()}`}
                            textAlign="left"
                            onClick={() => setSelectedCategory(category)}
                        ></TextButton>
                    ))}
                    <TextButton
                        key={"n"}
                        isActive={selectedCategory === "NaturalFeatures"}
                        text={"Natural Features"}
                        bacgroundColor={`--forest--dark`}
                        textAlign="left"
                        onClick={() => setSelectedCategory("NaturalFeatures")}
                    ></TextButton>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                    {possibleSynergies
                        .filter((s) => {
                            if (selectedCategory == "NaturalFeatures") {
                                if (!IO) {
                                    return naturalFeatures.find(n => n.synergyItemId == s.sourceBuildingId);
                                } else {
                                    return naturalFeatures.find(n => n.synergyItemId == s.targetBuildingId);
                                }
                            }
                            else {
                                const other = buildings.find(
                                    (b) => b.buildingId == (!IO ? s.sourceBuildingId : s.targetBuildingId),
                                );
                                return s.targetBuildingId == building.buildingId && other?.type == selectedCategory;
                            }

                        })
                        .map((s) => {
                            const other = selectedCategory == "NaturalFeatures" ? naturalFeatures.find(n => n.synergyItemId == (!IO ? s.sourceBuildingId : s.targetBuildingId))?.name : buildings.find(
                                (b) => b.buildingId == (!IO ? s.sourceBuildingId : s.targetBuildingId),
                            )?.name;
                            if (!other) return;
                            return (
                                <SynergyDisplay
                                    key={Math.random()}
                                    id={!IO ? s.sourceBuildingId.toString() : s.targetBuildingId.toString()}
                                    name={other}
                                    amount={null}
                                    productions={s.synergyProductions}
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
};
export default BuildingDocs;
