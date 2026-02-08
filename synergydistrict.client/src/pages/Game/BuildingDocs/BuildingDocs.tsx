import { type FC, useEffect, useRef, useState } from "react";
import ProductionListing from "../../../components/Game/ProductionListing/ProductionListing";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import type { BuildingType, SynergyProjection, ProductionProjection, Production } from "../../../types/Game/Buildings";
import styles from "./BuildingDocs.module.css";
import { useBuildingsBitmap } from "../../../hooks/providers/useBuildingsBitmap";
import TextButton from "../../../components/Buttons/TextButton/TextButton";
import type { BuildingCategory } from "../../../types/";
import ToggleButton from "../../../components/Buttons/ToggleButton/ToggleButton";
import { useGameData } from "../../../hooks/providers/useGameData";
import useGameResources from "../../../hooks/providers/useGameResources";
import { GetUnaffordableResources } from "../../../utils/PlacingUtils";
import SynergyDisplay from "../../../components/Game/SynergyDisplay";
import { GetIcon } from "../../../components/Icons";
import Tooltip from "../../../components/Tooltip/Tooltip";

const buildingCategories: BuildingCategory[] = [
    "Residential",
    "Commercial",
    "Industrial",
    "Extractional",
    "Recreational",
];

type BuildingDocsProps = {
    building: BuildingType;
    activeSynergies: SynergyProjection[];
    isExiting?: boolean;
};

type SynergyFilter = "incoming" | "outgoing" | "current"
const synergyFilter: SynergyFilter[] = ["incoming", "outgoing", "current"];

const BuildingDocs: FC<BuildingDocsProps> = ({ building, activeSynergies, isExiting }) => {
    const { buildingsBitmap } = useBuildingsBitmap();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedCategoryOutgoing, setSelectedCategoryOutgoing] = useState<BuildingCategory | "NaturalFeatures">("Residential");
    const [selectedCategoryIncoming, setSelectedCategoryIncoming] = useState<BuildingCategory | "NaturalFeatures">("Residential");
    const { synergies, buildings, naturalFeatures } = useGameData();
    const { GameResources } = useGameResources();
    const unaffordableResources = GetUnaffordableResources(building, GameResources);
    const [filter, setFilter] = useState<SynergyFilter>("incoming")
    const [userSelectedFilter, setUserSelectedFilter] = useState<SynergyFilter | null>(null);

    const possibleSynergies = synergies.filter((s) => {
        if (filter === "outgoing") return s.sourceBuildingId == building.buildingId;
        if (filter === "incoming") return s.targetBuildingId == building.buildingId;
        return s.sourceBuildingId == building.buildingId || s.targetBuildingId == building.buildingId;
    });

    const normalizeSynergyToProjection = (s: any, amount: number = 1): SynergyProjection => {
        const productionProjection: ProductionProjection[] = (s.synergyProductions || []).map((p: Production) => {
            const resourceKey = p.type.toLowerCase() as keyof typeof GameResources;
            const currentValue = (GameResources as any)[resourceKey];
            let detlaValue = 0;
            const totalValue = p.value * amount;

            if (typeof currentValue === "number") {
                if (resourceKey === "energy" && totalValue < 0) {
                    const usedAfter = GameResources.energyUsed - totalValue;
                    detlaValue = Math.max(0, usedAfter - GameResources.energy);
                } else if (resourceKey === "people" && totalValue < 0) {
                    const usedAfter = GameResources.peopleUsed - totalValue;
                    detlaValue = Math.max(0, usedAfter - GameResources.people);
                } else {
                    const after = currentValue + totalValue;
                    detlaValue = after < 0 ? -after : 0;
                }
            }

            return {
                production: { ...p, value: totalValue },
                detlaValue,
            } as ProductionProjection;
        });

        return {
            sourceBuildingId: s.sourceBuildingId,
            targetBuildingId: s.targetBuildingId,
            productionProjection,
        } as SynergyProjection;
    };

    useEffect(() => {
        if (userSelectedFilter === "current") return;

        if (activeSynergies && activeSynergies.length > 0) {
            if (filter !== "current") setFilter("current");
            return;
        }
        if (filter === "current" && userSelectedFilter !== null) setFilter(userSelectedFilter);
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

    useEffect(() => {
        const updateFor = (
            possibleList: any[],
            selected: BuildingCategory | "NaturalFeatures",
            setSelected: (c: BuildingCategory | "NaturalFeatures") => void,
        ) => {
            const cats = buildingCategories.filter((c) => {
                return possibleList.some((s) => {
                    const otherId = s.sourceBuildingId === building.buildingId ? s.targetBuildingId : s.sourceBuildingId;
                    const other = buildings.find((b) => b.buildingId == otherId);
                    return other?.type.toLowerCase() == c.toLowerCase();
                });
            });

            const hasNatural = possibleList.some((s) => {
                const otherId = s.sourceBuildingId === building.buildingId ? s.targetBuildingId : s.sourceBuildingId;
                return !!naturalFeatures.find((n) => n.synergyItemId == otherId);
            });

            const selectedIsValid = ((): boolean => {
                if (selected === "NaturalFeatures") return hasNatural;
                return cats.includes(selected as BuildingCategory);
            })();

            if (!selectedIsValid) {
                if (cats.length > 0) setSelected(cats[0]);
                else if (hasNatural) setSelected("NaturalFeatures");
                else setSelected(buildingCategories[0]);
            }
        };

        const possibleOutgoing = synergies.filter((s) => s.sourceBuildingId == building.buildingId);
        const possibleIncoming = synergies.filter((s) => s.targetBuildingId == building.buildingId);

        updateFor(possibleOutgoing, selectedCategoryOutgoing, setSelectedCategoryOutgoing);
        updateFor(possibleIncoming, selectedCategoryIncoming, setSelectedCategoryIncoming);
    }, [building.buildingId, synergies, buildings, naturalFeatures, selectedCategoryOutgoing, selectedCategoryIncoming]);

    const selectedCategoryForFilter = filter === "outgoing" ? selectedCategoryOutgoing : selectedCategoryIncoming;

    const displayedSynergies = filter == "current" ? (activeSynergies as SynergyProjection[])
    : possibleSynergies.filter((s) => {
        const otherId = ((): number => {
            if (filter === "outgoing") return s.targetBuildingId;
            if (filter === "incoming") return s.sourceBuildingId;
            return s.sourceBuildingId === building.buildingId ? s.targetBuildingId : s.sourceBuildingId;
        })();

        if (selectedCategoryForFilter == "NaturalFeatures") {
            return !!naturalFeatures.find(n => n.synergyItemId == otherId);
        } else {
            const other = buildings.find((b) => b.buildingId == otherId);
            return other?.type == selectedCategoryForFilter;
        }
    });

    // Normalize synergies to SynergyProjection[] for rendering and group duplicates by otherId
    type ExtendedSynergyProjection = SynergyProjection & { amount?: number };

    let normalizedDisplayedSynergies: ExtendedSynergyProjection[] = [];

    if (filter === "current") {
        // `displayedSynergies` comes from GetPreviewSynergies and already contains correct `amount`
        normalizedDisplayedSynergies = (displayedSynergies as SynergyProjection[]).map((s) => ({ ...(s as SynergyProjection) }));
    } else {
        const groupMap = new Map<number, { sample: any; count: number }>();
        (displayedSynergies as any[]).forEach((s) => {
            const otherId = ((): number => {
                if (filter === "outgoing") return s.targetBuildingId;
                if (filter === "incoming") return s.sourceBuildingId;
                return s.sourceBuildingId === building.buildingId ? s.targetBuildingId : s.sourceBuildingId;
            })();
            const existing = groupMap.get(otherId);
            if (existing) existing.count += 1;
            else groupMap.set(otherId, { sample: s, count: 1 });
        });

        normalizedDisplayedSynergies = Array.from(groupMap.values()).map(({ sample }) => {
            const proj = normalizeSynergyToProjection(sample, 1);
            return { ...(proj as SynergyProjection) } as ExtendedSynergyProjection;
        });
    }

    return (
        <div className={`${styles.buildingDocs} ${isExiting ? styles.exit : ''}`} style={{ userSelect: "none" }}>
            <div className={styles.title}>
                <h2>{building.name.toUpperCase()}_</h2>
                <span className={styles.buildingIcon}>{GetIcon(building.iconKey)}</span>
            </div>
            <p style={{marginTop: 0}}>{building.description}</p>
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
                            <div className={styles.icon}>
                                {GetIcon(product.type.toLowerCase() == "energy" ? "electricity" : product.type.toLowerCase())}
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
                            options={["incoming", "outgoing", "current"]}
                            selectedIndex={synergyFilter.indexOf(filter)}
                            onChange={(x) => {
                                const sel = synergyFilter[x];
                                setFilter(sel);
                                setUserSelectedFilter(sel);
                            }}
                            isIcons={true}
                            tooltips={[
                                <Tooltip title="Incoming synergies" description="Possible synergies this building can get from others."/>,
                                <Tooltip title="Outgoing synergies" description="Possible synergies this building can give to others"/>,
                                <Tooltip title="Current synergies" description="Synergies that would be created if you placed this building at this position"/>
                            ]}
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
                            isActive={selectedCategoryForFilter === category}
                            text={category}
                            bacgroundColor={`--${category.toLowerCase()}`}
                            textAlign="left"
                            onClick={() => {
                                if (filter === "outgoing") setSelectedCategoryOutgoing(category);
                                else setSelectedCategoryIncoming(category);
                            }}
                        ></TextButton>
                    ))}
                    {
                        filter == "current" ? null :(possibleSynergies.some(s => {
                            const otherId = ((): number => {
                                if (filter === "outgoing") return s.targetBuildingId;
                                if (filter === "incoming") return s.sourceBuildingId;
                                return s.sourceBuildingId === building.buildingId ? s.targetBuildingId : s.sourceBuildingId;
                            })();
                            return !!naturalFeatures.find(n => n.synergyItemId == otherId);
                        }) ?
                            <TextButton
                                key={"n"}
                                isActive={selectedCategoryForFilter === "NaturalFeatures"}
                                text={"Natural Features"}
                                bacgroundColor={`--forest--dark`}
                                textAlign="left"
                                onClick={() => {
                                    if (filter === "outgoing") setSelectedCategoryOutgoing("NaturalFeatures");
                                    else setSelectedCategoryIncoming("NaturalFeatures");
                                }}
                            ></TextButton> : null)
                    }
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                    {normalizedDisplayedSynergies.length == 0 && filter == "current" ? <div>No synergies would be created</div>
                    :normalizedDisplayedSynergies.map((s) => {
                        const otherId = ((): number => {
                            if (filter === "outgoing") return s.targetBuildingId;
                            if (filter === "incoming") return s.sourceBuildingId;
                            return s.sourceBuildingId === building.buildingId ? s.targetBuildingId : s.sourceBuildingId;
                        })();

                        const other = buildings.find((b) => b.buildingId == otherId)?.name
                            || naturalFeatures.find(n => n.synergyItemId == otherId)?.name;
                        if (!other) return null;
                        return (
                            <SynergyDisplay
                                key={Math.random()}
                                id={otherId.toString()}
                                name={other}
                                amount={filter === "current" ? (s.amount ?? null) : null}
                                productions={s.productionProjection}
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
