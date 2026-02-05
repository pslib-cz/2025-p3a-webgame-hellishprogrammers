import { useEffect, useRef, type FC } from "react";
import { useNavigate } from "react-router-dom";
import TextButton from "../../../components/Buttons/TextButton/TextButton";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
import styles from "./EndScreen.module.css";
import useGameResources from "../../../hooks/providers/useGameResources";
import useGameControl from "../../../hooks/providers/useGameControl";
import useGameMapData from "../../../hooks/providers/useMapData";
import { clearStoredState } from "../../../utils/stateStorage";
import { useGameOptions } from "../../../hooks/providers/useGameOptions";
import { defaultGameOptions } from "../../../types/Menu/GameOptions";
import { defaultGameMapData } from "../../../types/Game/GameMapData";
import { useSound } from "../../../hooks/useSound";
import { useHistory } from "../../../hooks/providers/useHistory";

const getRank = (score: number) => {
    if (score < 5000) return "F - INTERN";
    else if (score < 15000) return "D - BUILDER";
    else if (score < 30000) return "C - PLANNER";
    else if (score < 60000) return "B - ENGINEER";
    else return "S - VISIONARY";
};

const SESSION_PA_RESET_KEYS = ["gameControl", "gameMapData", "gameResources", "gameTime", "buildings", "synergies", "gameProperties"];

const EndScreen: FC = () => {
    const navigate = useNavigate();
    const { setGameControl } = useGameControl();
    const { options, setOptions } = useGameOptions();
    const { setGameMapData } = useGameMapData();
    const { setHistory } = useHistory();

    const playSuccess = useSound("SUCCESS");

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        setGameControl((prev) => ({ ...prev, timerSpeed: "pause" }));
        const newHistory = {
            score: score,
            date: new Date().toLocaleDateString(),
            money: GameResources.moneyBalance,
            people: GameResources.people,
            industry: GameResources.industry,
            happiness: happiness,
        };
        setHistory((prev) => [...prev, newHistory]);

        playSuccess();
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
        setOptions({ ...options, seed: defaultGameOptions.seed });
        setGameMapData({ ...defaultGameMapData });
        clearStoredState(SESSION_PA_RESET_KEYS);
        window.location.reload();
    };

    const handleExit = () => {
        clearStoredState(SESSION_PA_RESET_KEYS);
        navigate("/menu");
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
                <TextButton text="play again" onClick={handlePlayAgain} textAlign="left" />
                <TextButton text="exit" onClick={handleExit} textAlign="left" />
            </div>
        </div>
    );
};

export default EndScreen;
