import type { FC, ReactElement } from "react";
import styles from "./ShowInfo.module.css";

type ShowInfoProps = {
    left: ReactElement;
    right: ReactElement;
    gameStyle: boolean;
};

const ShowInfo: FC<ShowInfoProps> = ({ left, right, gameStyle = false }) => {
    return (
        <>
            <div className={gameStyle ? styles.showGameInfo : styles.showInfo }>
                <div className={`${gameStyle ? styles.showGameInfo__left :styles.showInfo__left} border`}>{left}</div>
                <div className={gameStyle ? styles.showGameInfo__right : styles.showInfo__right}>{right}</div>
            </div>
        </>
    );
};

export default ShowInfo;
