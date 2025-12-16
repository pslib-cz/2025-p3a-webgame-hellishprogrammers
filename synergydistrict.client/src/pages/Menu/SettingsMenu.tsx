import InputToggle from "../../components/Inputs/InputToggle";
import { useSettings } from "../../hooks/providers/useSettings";
import styles from "../../styles/Menu.module.css";

const SettingsMenu = () => {
    const { options, setOptions } = useSettings();

    return (
        <>
            <div className={styles.menuContent}>
                <h3>Main</h3>
                <InputToggle
                    text="Music"
                    options={["ON", "OFF"]}
                    selectedIndex={options.isMusic ? 0 : 1}
                    onChange={(index) => setOptions({ ...options, isMusic: index === 0 })}
                />
            </div>
        </>
    );
};

export default SettingsMenu;
