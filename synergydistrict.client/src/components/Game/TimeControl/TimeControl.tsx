import { type FC } from "react";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import useGameVariables from "../../../hooks/providers/useGameVariables";
import styles from "./TimeControl.module.css";

export const TimeControl: FC = () => {
    const { variables, setVariables } = useGameVariables();

    return (
        <div className={`${styles.timeControl} border`}>
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
    );
};
