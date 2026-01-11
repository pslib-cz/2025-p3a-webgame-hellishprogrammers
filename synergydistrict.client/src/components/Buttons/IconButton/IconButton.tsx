import type { FC } from "react";
import styles from "./IconButton.module.css";
type IconButtonProps = {
    isActive: boolean;
    iconKey: string;
    hasBorder?: boolean;
    OnClick: () => void;
};

export const IconButton: FC<IconButtonProps> = ({ isActive, OnClick, iconKey }) => {
    return (
        <button onClick={OnClick} className={`${styles.button} ${isActive ? styles.active : ""}`}>
            <span className={"icon"}>{iconKey}</span>
        </button>
    );
};
