import { useEffect, useState, type FC } from "react";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { useGameData } from "../../../hooks/providers/useGameData";
import styles from "./GameBar.module.css";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import type { BuildingType } from "../../../types/Game/Buildings";
import { CanAfford } from "../../../utils/PlacingUtils";
import useGameControl from "../../../hooks/providers/useGameControl";
import useGameResources from "../../../hooks/providers/useGameResources";
import useGameTime from "../../../hooks/providers/useGameTime";
import { useGameOptions } from "../../../hooks/providers/useGameOptions";
import { useSettings } from "../../../hooks/providers/useSettings";
import useGameMapData from "../../../hooks/providers/useMapData";
import type { TimerSpeedType } from "../../../types";
import TooltipContainer from "../../../components/Tooltip/TooltipContainer";
import Tooltip from "../../../components/Tooltip/Tooltip";
import { formatTime } from "../../../utils/timeUtils";

type GameBarProps = {
    setBuilding: (x: BuildingType | null) => void;
    onTimeSpeedChange: (newSpeed: TimerSpeedType) => void;
};

const GameBar: FC<GameBarProps> = ({ setBuilding, onTimeSpeedChange }) => {
    const { gameControl, setGameControl } = useGameControl();
    const { gameSettings, setGameSettings } = useSettings();
    const { GameResources } = useGameResources();
    const { GameMapData } = useGameMapData();
    const { time } = useGameTime();
    const { buildings, loading } = useGameData();
    const { TPS } = useGameProperties();
    const { options } = useGameOptions();
    const [activeBuilding, setActiveBuilding] = useState<BuildingType | null>(null);
    const [buildingAffordability, setBuildingAffordability] = useState<Record<string, boolean>>({});

    const formatNumber = (num: number) => {
        if(num >= 1000000) {
            return Math.round(num / 10000) / 100 + "M"
        }
        if(num >= 10000) {
            return Math.round(num / 10) / 100 + "k"
        }
        else{
            return num.toString()
        }
    }

    useEffect(() => {
        if (buildings) {
            const affordability: Record<string, boolean> = {};

            buildings.forEach((building) => {
                affordability[building.buildingId] = CanAfford(building, GameResources, GameMapData.placedBuildings);
            });

            setBuildingAffordability(affordability);
        } else {
            setBuildingAffordability({});
        }
    }, [GameResources, buildings, GameMapData.placedBuildings]);

    return (
        <div className={styles.gameBar}>
            <div className={styles.row}>
                <div className={`${styles.timeControl} border--narrow`}>
                    <IconButton
                        OnClick={() => {
                            setGameControl((v) => ({ ...v, timerSpeed: "pause" }));
                            onTimeSpeedChange("pause");
                        }}
                        isActive={gameControl.timerSpeed === "pause"}
                        iconKey="pause"
                    />
                    <IconButton
                        OnClick={() => {
                            setGameControl((v) => ({ ...v, timerSpeed: "play" }));
                            onTimeSpeedChange("play");
                        }}
                        isActive={gameControl.timerSpeed === "play"}
                        iconKey="play"
                    />
                    <IconButton
                        OnClick={() => {
                            setGameControl((v) => ({ ...v, timerSpeed: "fastforward" }));
                            onTimeSpeedChange("fastforward");
                        }}
                        isActive={gameControl.timerSpeed === "fastforward"}
                        iconKey="fastforward"
                    />
                </div>
                <div className="border--narrow">
                    <IconButton
                        OnClick={() => setGameSettings({ ...gameSettings, isMusic: !gameSettings.isMusic })}
                        isActive={gameSettings.isMusic}
                        iconKey={gameSettings.isMusic ? "volumeon" : "volumeoff"}
                    />
                </div>
                <div className={`${styles.timer} border--narrow`}>
                    <h3>{formatTime(options.gameDuration * 60 - time.timer / TPS)}</h3>
                </div>
            </div>
            <div className={styles.row}>
                {!loading &&
                    buildings &&
                    buildings!.map((building) => (
                        <div
                            key={building.buildingId}
                            className="border--narrow"
                            style={{ opacity: buildingAffordability[building.buildingId] ? 1 : 0.2 }}
                        >
                            <IconButton
                                OnClick={() => {
                                    const isSelected = activeBuilding?.buildingId === building.buildingId;
                                    const next = isSelected ? null : building;

                                    setBuilding(next);
                                    setActiveBuilding(next);
                                }}
                                isActive={activeBuilding?.buildingId === building.buildingId}
                                iconKey={building.iconKey}
                                sound={buildingAffordability[building.buildingId] ? "CLICK" : "ERROR"}
                            />
                        </div>
                    ))}
            </div>
            <div className={styles.row}>
                <div className={`${styles.values} border--narrow`}>
                    <TooltipContainer content={<Tooltip title="Money" description="Used to buy new buildings" />}>
                        <ValuesBox iconKey="money" text={`${formatNumber(GameResources.moneyBalance)} (${GameResources.money}/t)`} />
                    </TooltipContainer>
                </div>
                <div className={`${styles.values} border--narrow`}>
                    <TooltipContainer
                        content={<Tooltip title="People" description="Needed for buildings to be operational" />}
                    >
                        <ValuesBox
                            iconKey="people"
                            text={`${GameResources.people - GameResources.peopleUsed}/${GameResources.people}`}
                        />
                    </TooltipContainer>
                    <TooltipContainer
                        content={
                            <Tooltip title="Electricity" description="Building are not upgradable witout electricity" />
                        }
                    >
                        <ValuesBox
                            iconKey="electricity"
                            text={`${GameResources.energy - GameResources.energyUsed}/${GameResources.energy}`}
                        />
                    </TooltipContainer>
                    <TooltipContainer
                        content={<Tooltip title="Materials" description="Required for advanced procesing" />}
                    >
                        <ValuesBox iconKey="industry" text={`${GameResources.industry}`} />
                    </TooltipContainer>
                    <TooltipContainer
                        content={
                            <Tooltip
                                title="Happiness"
                                description="Greatly changes your score at the end of the game"
                            />
                        }
                    >
                        <ValuesBox
                            iconKey="happiness"
                            text={`${GameResources.happiness > 100 ? 100 : GameResources.happiness}%`}
                        />
                    </TooltipContainer>
                </div>
            </div>
        </div>
    );
};

export default GameBar;
