import { useState, type FC } from "react";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { useBuildings } from "../../../hooks/fetches/useBuildings";
import useGameVariables from "../../../hooks/providers/useGameVariables";
import styles from "./GameBar.module.css";

type GameBarProps = {
    setBuilding: (x: number | null) => void;
};

const GameBar: FC<GameBarProps> = ({ setBuilding }) => {
    const { variables, setVariables } = useGameVariables();
    const { data, loading, error } = useBuildings();
    const [activeBuilding, setActiveBuilding] = useState<number | null>(null);

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
                    <h3>{variables.timer}</h3>
                </div>
            </div>
            <div className={styles.row}>
                {!loading &&
                    data &&
                    data!.map((building) => (
                        <div key={building.buildingId} className="border--narrow">
                            <IconButton
                                OnClick={() => {
                                    const id = activeBuilding === null || building.buildingId !== activeBuilding ? building.buildingId : null;
                                    setBuilding(id);
                                    setActiveBuilding(id);
                                }}
                                isActive={building.buildingId === activeBuilding}
                                iconKey={building.iconKey}
                            />
                        </div>
                    ))}
            </div>
            <div className={styles.row}></div>
        </div>
    );
};

export default GameBar;
