import { useState, type FC } from "react";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { useGameData } from "../../../hooks/providers/useGameData";
import useGameVariables from "../../../hooks/providers/useGameVariables";
import styles from "./GameBar.module.css";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import type { BuildingType } from "../../../types/Game/Buildings";

type GameBarProps = {
    setBuilding: (x: BuildingType | null) => void;
};

const GameBar: FC<GameBarProps> = ({ setBuilding }) => {
    const { variables, setVariables } = useGameVariables();
    const { buildings, loading } = useGameData();
    const { TPS } = useGameProperties();
    const [activeBuilding, setActiveBuilding] = useState<BuildingType | null>(null);

    const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, "0");
    const seconds = Math.floor(totalSeconds % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${seconds}`;
};

    return (
        <div className={styles.gameBar}>
            <div className={styles.row}>
                <div className={`${styles.timeControl} border--narrow`}>
                    <IconButton
                        OnClick={() => setVariables((v) => ({ ...v, timerSpeed: "pause" }))}
                        isActive={variables.timerSpeed === "pause"}
                        iconKey="pause"
                    />
                    <IconButton
                        OnClick={() => setVariables((v) => ({ ...v, timerSpeed: "play" }))}
                        isActive={variables.timerSpeed === "play"}
                        iconKey="play"
                    />
                    <IconButton
                        OnClick={() => setVariables((v) => ({ ...v, timerSpeed: "fastforward" }))}
                        isActive={variables.timerSpeed === "fastforward"}
                        iconKey="fastforward"
                    />
                </div>
                <div className="border--narrow">
                    <IconButton
                        OnClick={() => setVariables((v) => ({ ...v, isSound: !v.isSound }))}
                        isActive={variables.isSound}
                        iconKey={variables.isSound ? "volumeon" : "volumeoff"}
                    />
                </div>
                <div className={`${styles.timer} border--narrow`}>
                    <h3>{formatTime(variables.timer / TPS)}</h3>
                </div>
            </div>
            <div className={styles.row}>
                {!loading &&
                    buildings &&
                    buildings!.map((building) => (
                        <div key={building.buildingId} className="border--narrow">
                            <IconButton
                                OnClick={() => {
                                    const isSelected = activeBuilding?.buildingId === building.buildingId;
                                    const next = isSelected ? null : building;
                                    
                                    setBuilding(next);
                                    setActiveBuilding(next);
                                }}
                                isActive={activeBuilding?.buildingId === building.buildingId}
                                iconKey={building.iconKey}
                            />
                        </div>
                    ))}
            </div>
            <div className={styles.row}>
                <div className={`${styles.values} border--narrow`}>
                    <ValuesBox iconKey="money" text={`${variables.moneyCurrent} (${variables.moneyPerTick}/t)`} />
                </div>
                <div className={`${styles.values} border--narrow`}>
                    <ValuesBox iconKey="people" text={`${variables.peopleCurrent}/${variables.peopleMax}`} />
                    <ValuesBox iconKey="electricity" text={`${variables.energyCurrent}/${variables.energyMax}`} />
                    <ValuesBox iconKey="industry" text={`${variables.industry}`} />
                    <ValuesBox iconKey="happiness" text={`${variables.happiness}%`} />
                </div>
            </div>
        </div>
    );
};

export default GameBar;
