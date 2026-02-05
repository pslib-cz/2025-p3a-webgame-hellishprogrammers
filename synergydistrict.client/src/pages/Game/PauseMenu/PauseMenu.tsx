import { useNavigate } from "react-router-dom";
import { useSettings } from "../../../hooks/providers/useSettings";
import InputToggle from "../../../components/Inputs/InputToggle";
import InputValue from "../../../components/Inputs/InputValue/InputValue";
import TextButton from "../../../components/Buttons/TextButton/TextButton";
import styles from "./PauseMenu.module.css";
import { clearStoredState } from "../../../utils/stateStorage";

const SESSION_GAME_KEYS = ["gameControl", "gameMapData", "gameResources", "gameTime", "buildings", "synergies", "gameProperties"];

interface PauseMenuProps {
    onResume: () => void;
}

const PauseMenu = ({ onResume }: PauseMenuProps) => {
    const navigate = useNavigate();
    const { gameSettings, setGameSettings } = useSettings();

    const handleCrtIntensityChange = (value: string) => {
        const numValue = parseInt(value) || 0;
        const clampedValue = Math.max(0, Math.min(100, numValue));
        setGameSettings({ ...gameSettings, crtIntensity: clampedValue });
    };

    const handleQuit = () => {
        clearStoredState(SESSION_GAME_KEYS);
        navigate("/menu");
    };

    return (
        <div className={styles.overlay} onClick={onResume}>
            <div className={styles.pauseMenu} onClick={(e) => e.stopPropagation()}>
                <h2>Game Paused</h2>

                <div className={styles.menuSection}>
                    <h3>Settings</h3>
                    <InputToggle
                        text="Music"
                        options={["ON", "OFF"]}
                        selectedIndex={gameSettings.isMusic ? 0 : 1}
                        onChange={(index) => setGameSettings({ ...gameSettings, isMusic: index === 0 })}
                    />
                    <InputToggle
                        text="Sounds"
                        options={["ON", "OFF"]}
                        selectedIndex={gameSettings.isSound ? 0 : 1}
                        onChange={(index) => setGameSettings({ ...gameSettings, isSound: index === 0 })}
                    />
                    <InputValue
                        text="CRT Effect"
                        inputType="number"
                        value={gameSettings.crtIntensity}
                        onChange={handleCrtIntensityChange}
                    />
                </div>

                <div className={styles.buttonGroup}>
                    <TextButton text="Resume Game" onClick={onResume} />
                    <TextButton text="Quit to Menu" onClick={handleQuit} bacgroundColor="--commercial" />
                </div>

                <p className={styles.hint}>Press ESC to resume</p>
            </div>
        </div>
    );
};

export default PauseMenu;
