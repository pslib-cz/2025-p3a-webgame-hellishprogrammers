import type { FC, ReactElement } from "react";
import styles from "./ShowInfo.module.css";

type ShowInfoProps = {
    left: ReactElement;
    right: ReactElement;
    gameStyle?: boolean;
    animationDelay?: boolean;
};

const ShowInfo: FC<ShowInfoProps> = ({ left, right, gameStyle = false, animationDelay }) => {

    const getAnimationDelay = () => {
        animationDelay = animationDelay ?? true;
        return animationDelay ? "" : "0s";
    }

    return (
        <>
            <div className={gameStyle ? styles.showGameInfo : styles.showInfo} style={{animationDelay: `${getAnimationDelay()}`}}>
                <div className={`${gameStyle ? styles.showGameInfo__left : styles.showInfo__left} border`}>{left}</div>
                <div className={gameStyle ? styles.showGameInfo__right : styles.showInfo__right}>{right}</div>
            </div>
        </>
    );
};

export default ShowInfo;
