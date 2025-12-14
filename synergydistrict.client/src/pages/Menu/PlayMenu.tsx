import InputToggle from "../../components/Inputs/InputToggle";
import InputValue from "../../components/Inputs/InputValue";
import TextButton from "../../components/TextButton";
import ToggleButton from "../../components/ToggleButton";
import { useGameOptions } from "../../hooks/useGameOptions";
import styles from "/src/styles/Menu.module.css";

const PlayMenu = () => {
  const { options, setOptions } = useGameOptions();

  return (
    <>
      <div className={styles.playMenu}>
        <h3>Gamemode</h3>
        <ToggleButton
          options={["Time presure", "Survival"]}
          selectedIndex={options.gameMode === "timePresure" ? 0 : 1}
          onChange={(index) => setOptions({ ...options, gameMode: index === 0 ? "timePresure" : "survival" })}
        />
        <h3>Options</h3>
        <InputValue
          text="Duration"
          inputType="number"
          value={options.gameDuration || ""}
          onChange={(val) => setOptions({ ...options, gameDuration: Number(val) })}
        />
        <InputToggle
          text="Infinite map"
          options={["ON", "OFF"]}
          selectedIndex={options.infiniteMap ? 0 : 1}
          onChange={(index) => setOptions({ ...options, infiniteMap: index === 0 })}
        />
        <InputValue
          text="Map size"
          inputType="number"
          value={options.mapSize || ""}
          onChange={(val) => setOptions({ ...options, mapSize: Number(val) })}
        />
      </div>
      <div className={`h2 ${styles.right}`}>
        <TextButton text="start" linkTo="/game" />
      </div>
    </>
  );
};

export default PlayMenu;
