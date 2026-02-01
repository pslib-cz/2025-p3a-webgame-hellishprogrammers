import type { FC } from "react";
import styles from "./IconButton.module.css";
import { useSound, type SoundPath } from "../../../hooks/useSound";
type IconButtonProps = {
    isActive: boolean;
    iconKey: string;
    hasBorder?: boolean;
    OnClick: () => void;
    sound?: SoundPath;
};

export const IconButton: FC<IconButtonProps> = ({ isActive, OnClick, iconKey, sound = "CLICK" }) => {
    const playSound = useSound(sound);
    return (
        <button
            onClick={() => {
                playSound();
                OnClick();
            }}
            className={`${styles.button} ${isActive ? styles.active : ""}`}
        >
            <span className={"icon"}>{iconKey}</span>
        </button>
    );
};
