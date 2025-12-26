import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import useGameVariables from "../../../hooks/providers/useGameVariables";
import styles from "./GameBar.module.css";

const GameBar = () => {
    const { variables, setVariables } = useGameVariables();

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
                
            </div>
        </div>
    );
};

export default GameBar;
