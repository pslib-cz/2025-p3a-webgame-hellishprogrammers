import { BuildingBar } from "../../../components/Game/BuildingBar";
import { TimeControl } from "../../../components/Game/TimeControl";
import styles from "./GameBar.module.css";

const GameBar = () => {
    return (
        <div className={styles.gameBar}>
            <TimeControl selectedTimer={(x) => x} />
            {/* <BuildingBar buttonName="townhall" amount={8} /> */}
        </div>
    );
};

export default GameBar;
