import InputToggle from "../../components/Inputs/InputToggle";
import InputValue from "../../components/Inputs/InputValue/InputValue";
import { useSettings } from "../../hooks/providers/useSettings";
import styles from "../../styles/Menu.module.css";
import { useState } from "react";

const SettingsMenu = () => {
    const { gameSettings, setGameSettings } = useSettings();
    const [uiScaleInput, setUiScaleInput] = useState(gameSettings.uiScale.toString());

    const handleCrtIntensityChange = (value: string) => {
        const numValue = parseInt(value) || 0;
        const clampedValue = Math.max(0, Math.min(100, numValue));
        setGameSettings({ ...gameSettings, crtIntensity: clampedValue });
    };

    const handleUiScaleInputChange = (value: string) => {
        setUiScaleInput(value);
    };

    const commitUiScaleChange = () => {
        const numValue = parseInt(uiScaleInput) || 100;
        const clampedValue = Math.max(50, Math.min(200, numValue));
        setUiScaleInput(clampedValue.toString());
        setGameSettings({ ...gameSettings, uiScale: clampedValue });
    };

    return (
        <>
            <div className={styles.menuContent}>
                <h3>Main</h3>
                <InputToggle
                    text="Music"
                    options={["ON", "OFF"]}
                    selectedIndex={gameSettings.isMusic ? 0 : 1}
                    onChange={(index) => setGameSettings({ ...gameSettings, isMusic: index === 0 })}
                />
                <InputValue
                    text="CRT Effect"
                    inputType="number"
                    value={gameSettings.crtIntensity}
                    onChange={handleCrtIntensityChange}
                />
                <InputValue
                    text="UI Scale (%)"
                    inputType="number"
                    value={uiScaleInput}
                    onChange={handleUiScaleInputChange}
                    onBlur={commitUiScaleChange}
                    onEnter={commitUiScaleChange}
                />
            </div>
        </>
    );
};

export default SettingsMenu;
