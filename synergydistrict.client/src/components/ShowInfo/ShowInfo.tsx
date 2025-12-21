import type { FC, ReactElement } from "react";
import styles from "./ShowInfo.module.css";

type ShowInfoProps = {
    left: ReactElement;
    right: ReactElement;
};

const ShowInfo: FC<ShowInfoProps> = ({ left, right }) => {
    return (
        <>
            <div className={styles.showInfo}>
                <div className={`${styles.showInfo__left} border`}>{left}</div>
                <div className={styles.showInfo__right}>{right}</div>
            </div>
        </>
    );
};

export default ShowInfo;
