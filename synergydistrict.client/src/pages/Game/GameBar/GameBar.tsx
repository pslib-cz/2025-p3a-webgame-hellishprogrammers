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

type GameBarProps = {
  setBuilding: (x: BuildingType | null) => void;
};

const GameBar: FC<GameBarProps> = ({ setBuilding }) => {
  const { gameControl, setGameControl } = useGameControl();
  const { GameResources } = useGameResources();
  const { time } = useGameTime();
  const { buildings, loading } = useGameData();
  const { TPS } = useGameProperties();
  const { options } = useGameOptions();
  const [activeBuilding, setActiveBuilding] = useState<BuildingType | null>(null);
  const [buildingAffordability, setBuildingAffordability] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (buildings) {
      const affordability: Record<string, boolean> = {};
      buildings.forEach((building) => {
        affordability[building.buildingId] = CanAfford(building, GameResources);
      });
      setBuildingAffordability(affordability);
    } else {
      setBuildingAffordability({});
    }
  }, [GameResources, buildings]);



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
            OnClick={() => setGameControl((v) => ({ ...v, timerSpeed: "pause" }))}
            isActive={gameControl.timerSpeed === "pause"}
            iconKey="pause"
            canAfford={true}
          />
          <IconButton
            OnClick={() => setGameControl((v) => ({ ...v, timerSpeed: "play" }))}
            isActive={gameControl.timerSpeed === "play"}
            iconKey="play"
            canAfford={true}
          />
          <IconButton
            OnClick={() => setGameControl((v) => ({ ...v, timerSpeed: "fastforward" }))}
            isActive={gameControl.timerSpeed === "fastforward"}
            iconKey="fastforward"
            canAfford={true}
          />
        </div>
        <div className="border--narrow">
          <IconButton
            OnClick={() => setGameControl((v) => ({ ...v, isSound: !v.isSound }))}
            isActive={gameControl.isSound}
            iconKey={gameControl.isSound ? "volumeon" : "volumeoff"}
            canAfford={true}
          />
        </div>
        <div className={`${styles.timer} border--narrow`}>
          <h3>{formatTime((options.gameDuration * 60) - (time.timer / TPS))}</h3>
        </div>
      </div>
      <div className={styles.row}>
        {!loading &&
          buildings &&
          buildings!.map((building) => (
            <div key={building.buildingId} className="border--narrow" style={{ opacity: buildingAffordability[building.buildingId] ? 1 : 0.2 }}>
              <IconButton
                OnClick={() => {
                  const isSelected = activeBuilding?.buildingId === building.buildingId;
                  const next = isSelected ? null : building;

                  setBuilding(next);
                  setActiveBuilding(next);
                }}
                isActive={activeBuilding?.buildingId === building.buildingId}
                iconKey={building.iconKey}
                canAfford={buildingAffordability[building.buildingId]}
              />
            </div>
          ))}
      </div>
      <div className={styles.row}>
        <div className={`${styles.values} border--narrow`}>
          <ValuesBox iconKey="money" text={`${GameResources.moneyBalance} (${GameResources.money}/t)`} />
        </div>
        <div className={`${styles.values} border--narrow`}>
          <ValuesBox iconKey="people" text={`${GameResources.people - GameResources.peopleUsed}/${GameResources.people}`} />
          <ValuesBox iconKey="electricity" text={`${GameResources.energy - GameResources.energyUsed}/${GameResources.energy}`} />
          <ValuesBox iconKey="industry" text={`${GameResources.industry}`} />
          <ValuesBox iconKey="happiness" text={`${GameResources.happiness > 100 ? 100 : GameResources.happiness}%`} />
        </div>
      </div>
    </div>
  );
};

export default GameBar;
