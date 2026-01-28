import type { FC, ReactElement, CSSProperties } from "react";
import styles from "./ShowInfo.module.css";

type ShowInfoProps = {
    left: ReactElement;
    right: ReactElement;
    gameStyle?: boolean;
    animationDelay?: boolean;
    style?: CSSProperties;
};

const ShowInfo: FC<ShowInfoProps> = ({ left, right, gameStyle = false, animationDelay, style }) => {

    const getAnimationDelay = () => {
        animationDelay = animationDelay ?? true;
        return animationDelay ? "" : "0s";
    }

    return (
        <>
            <div className={gameStyle ? styles.showGameInfo : styles.showInfo} style={{animationDelay: `${getAnimationDelay()}`, ...style}}>
                <div className={`${gameStyle ? styles.showGameInfo__left : styles.showInfo__left} border`}>{left}</div>
                <div className={gameStyle ? styles.showGameInfo__right : styles.showInfo__right}>{right}</div>
            </div>
        </>
    );
};

export default ShowInfo;
