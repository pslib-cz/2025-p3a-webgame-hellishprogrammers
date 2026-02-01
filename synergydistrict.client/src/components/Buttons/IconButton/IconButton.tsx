import type { FC } from "react";
import styles from "./IconButton.module.css";
import { useSound, type SoundPath } from "../../../hooks/useSound";
type IconButtonProps = {
    isActive: boolean;
    iconKey: string;
    hasBorder?: boolean;
    OnClick: () => void;
    sound?: SoundPath;
    disabled?: boolean;
};

export const IconButton: FC<IconButtonProps> = ({ isActive, OnClick, iconKey, sound = "CLICK", disabled = false }) => {
    const playSound = useSound(sound);
    return (
        <button disabled={disabled}
            onClick={disabled ? undefined : () => {
                playSound();
                OnClick();
            }}
            className={`${styles.button} ${isActive ? styles.active : ""} ${disabled ? styles.disabled : ""}`}
        >
            <span className={"icon"}>{iconKey}</span>
        </button>
    );
};
