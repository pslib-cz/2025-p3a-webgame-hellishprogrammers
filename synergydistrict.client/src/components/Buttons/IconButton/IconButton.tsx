import type { FC } from "react";
import styles from "./IconButton.module.css";
type IconButtonProps = {
  canAfford: boolean;
  isActive: boolean;
  iconKey: string;
  OnClick: () => void;
};

export const IconButton: FC<IconButtonProps> = ({ isActive, OnClick, iconKey, canAfford }) => {
  return (
    <button disabled={!canAfford} onClick={OnClick} className={`${styles.button} ${isActive ? styles.active : ""}`}>
      <span className={"icon"}>{iconKey}</span>
    </button>
  );
};
