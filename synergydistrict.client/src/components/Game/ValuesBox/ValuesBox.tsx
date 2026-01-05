import type { FC } from "react";
import styles from "./ValuesBox.module.css";

type ValuesBoxProps = {
    iconKey: string;
    text: string;
};

const ValuesBox: FC<ValuesBoxProps> = ({ iconKey, text }) => {
    return (
        <div className={styles.valuesBox}>
            <div className={`${styles.icon} icon`}>{iconKey}</div>
            <div>{text}</div>
        </div>
    );
};

export default ValuesBox;
