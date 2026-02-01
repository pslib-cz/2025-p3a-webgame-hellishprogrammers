import type { FC } from "react";
import styles from "./IconButton.module.css";
type IconButtonProps = {
    isActive: boolean;
    iconKey: string;
    hasBorder?: boolean;
    OnClick: () => void;
    disabled?: boolean;
};

export const IconButton: FC<IconButtonProps> = ({ isActive, OnClick, iconKey, disabled = false }) => {
    return (
        <button disabled={disabled} onClick={disabled ? undefined : OnClick} className={`${styles.button} ${isActive ? styles.active : ""} ${disabled ? styles.disabled : ""}`}>
            <span className={"icon"}>{iconKey}</span>
        </button>
    );
};
