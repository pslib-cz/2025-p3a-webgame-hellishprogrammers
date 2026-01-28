import type { FC, CSSProperties } from "react";
import styles from "./ValuesBox.module.css";

export type ValuesBoxProps = {
    iconKey: string;
    text: string;
    style?: CSSProperties;
};

const ValuesBox: FC<ValuesBoxProps> = ({ iconKey, text, style }) => {
    return (
        <div className={styles.valuesBox} style={style}>
            <div className={`${styles.icon} icon`}>{iconKey}</div>
            <div>{text}</div>
        </div>
    );
};

export default ValuesBox;
