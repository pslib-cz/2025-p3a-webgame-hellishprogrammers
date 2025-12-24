import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { TimeControl } from "../../../components/Game/TimeControl/TimeControl";
import useGameVariables from "../../../hooks/providers/useGameVariables";
import styles from "./GameBar.module.css";

const GameBar = () => {
    const { variables, setVariables } = useGameVariables();

    return (
        <div className={styles.gameBar}>
            <div className={styles.timeSection}>
                <TimeControl />
                <div className="border">
                    <IconButton
                        OnClick={() => setVariables((v) => ({ ...v, isSound: !v.isSound }))}
                        isActive={variables.isSound}
                        iconKey={variables.isSound ? "volumeon" : "volumeoff"}
                    />
                </div>
                <div className={`${styles.timer} border`}>
                    <h3>{variables.timer}</h3>
                </div>
            </div>
            {/* <BuildingBar buttonName="townhall" amount={8} /> */}
        </div>
    );
};

export default GameBar;
