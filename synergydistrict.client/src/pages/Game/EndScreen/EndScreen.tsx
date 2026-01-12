import { useEffect, type FC } from "react";
import TextButton from "../../../components/Buttons/TextButton/TextButton";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import styles from "./EndScreen.module.css";
import useGameResources from "../../../hooks/providers/useGameResources";
import useGameControl from "../../../hooks/providers/useGameControl";

const getRank = (score: number) => {
    if (score < 5000) return "F - INTERN";
    else if (score < 15000) return "D - BUILDER";
    else if (score < 30000) return "C - PLANNER";
    else if (score < 60000) return "B - ENGINEER";
    else return "S - VISIONARY";
};

const EndScreen: FC = () => {
    const { setGameControl } = useGameControl();

    useEffect(() => {
        setGameControl((prev) => ({ ...prev, timerSpeed: "pause" }));
    }, []);

    const { GameResources } = useGameResources();

    const moneyPt = GameResources.moneyBalance;
    const peoplePt = GameResources.people * 50;
    const industryPt = GameResources.industry * 10;

    const happiness = GameResources.happiness > 100 ? 100 : GameResources.happiness;

    const subtotal = moneyPt + peoplePt + industryPt;
    const multiplier = Math.round((happiness / 50) * 100) / 100;

    const score = Math.round(subtotal * multiplier);

    const handlePlayAgain = () => {
        window.location.reload();
    };
    const handleExit = () => {
        // remove data from session storage
    };

    return (
        <div className={styles.endScreen}>
            <h2 className={styles.title}>SESSION_TERMINATED</h2>

            <div className={styles.box}>
                <ValuesBox iconKey="money" text={GameResources.moneyBalance.toString()} />
                <p>{moneyPt}pt</p>
                <p>(1 pt per $1)</p>
                <ValuesBox iconKey="people" text={GameResources.people.toString()} />
                <p>{peoplePt}pt</p>
                <p>(50 pts per head)</p>

                <ValuesBox iconKey="industry" text={GameResources.industry.toString()} />
                <p>{industryPt}pt</p>
                <p>(10 pts per unit)</p>
            </div>

            <ShowInfo left={<p>Subtotal</p>} right={<div className={`${styles.right} border`}>{subtotal}</div>} />

            <div className={styles.box}>
                <ValuesBox iconKey="happiness" text={`${happiness}%`} />

                <p>{multiplier}x</p>

                <p>(Multiplier applied)</p>
            </div>

            <ShowInfo left={<p>Final score</p>} right={<div className={`${styles.right} border`}>{score}</div>} />

            <ShowInfo left={<p>Rank</p>} right={<div className={`${styles.right} border`}>{getRank(score)}</div>} />

            <div className={`h2 ${styles.buttons}`}>
                <TextButton text="play again" onClick={handlePlayAgain} />
                <TextButton text="exit" linkTo="/menu" onClick={handleExit} />
            </div>
        </div>
    );
};

export default EndScreen;
