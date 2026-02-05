import { useHistory } from "../../../hooks/providers/useHistory";
import ValuesBox from "../../Game/ValuesBox/ValuesBox";
import ShowInfo from "../../ShowInfo/ShowInfo";
import styles from "./History.module.css";

const History = () => {
    const { history } = useHistory();

    return (
        <>
            {history.length === 0 ? (
                <p>No games where played yet...</p>
            ) : (
                [...history].reverse().map((h, index) => (
                    <ShowInfo
                        key={Math.random()}
                        left={
                            <div className={styles.left}>
                                <h3>{h.score} pt</h3>
                                <span>{h.date}</span>
                            </div>
                        }
                        right={
                            <div className={`${styles.right} border`}>
                                <ValuesBox iconKey={"money"} text={h.money.toString()} />
                                <ValuesBox iconKey={"people"} text={h.people.toString()} />
                                <ValuesBox iconKey={"industry"} text={h.industry.toString()} />
                                <ValuesBox iconKey={"happiness"} text={`${h.happiness}%`} />
                            </div>
                        }
                        style={{
                            animationDelay: `calc(var(--menu-animation-base-delay) + var(--menu-animation-step-delay) * ${index + 2})`,
                        }}
                    />
                ))
            )}
        </>
    );
};

export default History;
