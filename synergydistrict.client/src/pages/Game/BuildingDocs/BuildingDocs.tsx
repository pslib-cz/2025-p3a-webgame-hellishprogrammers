import { type FC, useEffect, useRef, useState } from "react";
import ProductionListing from "../../../components/Game/ProductionListing/ProductionListing";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import type { BuildingSynergy, BuildingType } from "../../../types/Game/Buildings";
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
    activeSynergies: BuildingSynergy[]
};

type SynergyFilter = "incoming" | "outgoing" | "current"
const synergyFilter: SynergyFilter[] = ["incoming", "outgoing", "current"];

const BuildingDocs: FC<BuildingDocsProps> = ({ building, activeSynergies }) => {
    const { buildingsBitmap } = useBuildingsBitmap();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<BuildingCategory | "NaturalFeatures">("Residential");
    const { synergies, buildings, naturalFeatures } = useGameData();
    const { GameResources } = useGameResources();
    const unaffordableResources = GetUnaffordableResources(building, GameResources);
    const [filter, setFilter] = useState<SynergyFilter>("outgoing")
    const [userSelectedFilter, setUserSelectedFilter] = useState<SynergyFilter | null>(null);

    const possibleSynergies = synergies.filter((s) => {
        if (filter === "outgoing") return s.sourceBuildingId == building.buildingId;
        if (filter === "incoming") return s.targetBuildingId == building.buildingId;
        return s.sourceBuildingId == building.buildingId || s.targetBuildingId == building.buildingId;
    });

    useEffect(() => {
        if (userSelectedFilter === "current") return;

        if (activeSynergies && activeSynergies.length > 0) {
            if (filter !== "current") setFilter("current");
            return;
        }
        if (filter === "current") setFilter("outgoing");
    }, [activeSynergies, userSelectedFilter, filter]);

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

    const displayedSynergies = filter == "current" ? activeSynergies
    : possibleSynergies.filter((s) => {
        const otherId = ((): number => {
            if (filter === "outgoing") return s.targetBuildingId;
            if (filter === "incoming") return s.sourceBuildingId;
            return s.sourceBuildingId === building.buildingId ? s.targetBuildingId : s.sourceBuildingId;
        })();

        if (selectedCategory == "NaturalFeatures") {
            return !!naturalFeatures.find(n => n.synergyItemId == otherId);
        } else {
            const other = buildings.find((b) => b.buildingId == otherId);
            return other?.type == selectedCategory;
        }
    });

    return (
        <div className={styles.buildingDocs} style={{ userSelect: "none" }}>
            <div className={styles.title}>
                <h2>{building.name.toUpperCase()}_</h2>
                <span className={`${styles.icon} icon`}>{building.iconKey}</span>
            </div>
            <p>{building.description}</p>
            <ProductionListing title="Cost" style={{ opacity: unaffordableResources.has("moneyBalance") ? ".2" : "1" } as React.CSSProperties}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 className={styles.title}>Synergy</h3>
                    <div style={{ fontSize: "0.75rem" }}>
                        <ToggleButton
                            options={["I", "O", "C"]}
                            selectedIndex={synergyFilter.indexOf(filter)}
                            onChange={(x) => {
                                const sel = synergyFilter[x];
                                setFilter(sel);
                                setUserSelectedFilter(sel);
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    {filter == "current" ? null: buildingCategories.filter(c => {
                        return possibleSynergies.some(s => {
                            const otherId = ((): number => {
                                if (filter === "outgoing") return s.targetBuildingId;
                                if (filter === "incoming") return s.sourceBuildingId;
                                return s.sourceBuildingId === building.buildingId ? s.targetBuildingId : s.sourceBuildingId;
                            })();
                            const other = buildings.find((b) => b.buildingId == otherId);
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
                    {
                        possibleSynergies.some(s => {
                            const otherId = ((): number => {
                                if (filter === "outgoing") return s.targetBuildingId;
                                if (filter === "incoming") return s.sourceBuildingId;
                                return s.sourceBuildingId === building.buildingId ? s.targetBuildingId : s.sourceBuildingId;
                            })();
                            return !!naturalFeatures.find(n => n.synergyItemId == otherId);
                        }) ?
                            <TextButton
                                key={"n"}
                                isActive={selectedCategory === "NaturalFeatures"}
                                text={"Natural Features"}
                                bacgroundColor={`--forest--dark`}
                                textAlign="left"
                                onClick={() => setSelectedCategory("NaturalFeatures")}
                            ></TextButton> : null
                    }
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                    {displayedSynergies.map((s) => {
                        const otherId = ((): number => {
                            if (filter === "outgoing") return s.targetBuildingId;
                            if (filter === "incoming") return s.sourceBuildingId;
                            return s.sourceBuildingId === building.buildingId ? s.targetBuildingId : s.sourceBuildingId;
                        })();

                        const other = selectedCategory == "NaturalFeatures"
                            ? naturalFeatures.find(n => n.synergyItemId == otherId)?.name
                            : buildings.find((b) => b.buildingId == otherId)?.name;

                        if (!other) return null;
                        return (
                            <SynergyDisplay
                                key={Math.random()}
                                id={otherId.toString()}
                                name={other}
                                amount={null}
                                productions={s.synergyProductions}
                                highlight={filter == "current"}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default BuildingDocs;
