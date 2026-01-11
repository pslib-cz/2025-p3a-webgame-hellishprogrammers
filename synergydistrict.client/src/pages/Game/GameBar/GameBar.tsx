import { useState, type FC } from "react";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { useGameData } from "../../../hooks/providers/useGameData";
import useGameVariables from "../../../hooks/providers/useGameVariables";
import styles from "./GameBar.module.css";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import type { BuildingType } from "../../../types/Game/Buildings";
import { CanAfford } from "../../../utils/PlacingUtils";

type GameBarProps = {
  setBuilding: (x: BuildingType | null) => void;
};

const GameBar: FC<GameBarProps> = ({ setBuilding }) => {
  const { variables, setVariables } = useGameVariables();
  // console.log(variables)
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
            canAfford={true}
          />
          <IconButton
            OnClick={() => setVariables((v) => ({ ...v, timerSpeed: "play" }))}
            isActive={variables.timerSpeed === "play"}
            iconKey="play"
            canAfford={true}
          />
          <IconButton
            OnClick={() => setVariables((v) => ({ ...v, timerSpeed: "fastforward" }))}
            isActive={variables.timerSpeed === "fastforward"}
            iconKey="fastforward"
            canAfford={true}
          />
        </div>
        <div className="border--narrow">
          <IconButton
            OnClick={() => setVariables((v) => ({ ...v, isSound: !v.isSound }))}
            isActive={variables.isSound}
            iconKey={variables.isSound ? "volumeon" : "volumeoff"}
            canAfford={true}
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
                canAfford={CanAfford(building, variables)}
              />
            </div>
          ))}
      </div>
      <div className={styles.row}>
        <div className={`${styles.values} border--narrow`}>
          <ValuesBox iconKey="money" text={`${variables.moneyBalance} (${variables.money}/t)`} />
        </div>
        <div className={`${styles.values} border--narrow`}>
          <ValuesBox iconKey="people" text={`${variables.people - variables.peopleUsed}/${variables.people}`} />
          <ValuesBox iconKey="electricity" text={`${variables.energy - variables.energyUsed}/${variables.energy}`} />
          <ValuesBox iconKey="industry" text={`${variables.industry}`} />
          <ValuesBox iconKey="happiness" text={`${variables.happiness > 100 ? 100 : variables.happiness}%`} />
        </div>
      </div>
    </div>
  );
};

export default GameBar;
