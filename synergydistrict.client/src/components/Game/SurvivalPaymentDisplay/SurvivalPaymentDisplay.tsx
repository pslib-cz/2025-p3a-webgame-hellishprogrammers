import { type FC } from "react";
import styles from "./SurvivalPaymentDisplay.module.css"
import useGameTime from "../../../hooks/providers/useGameTime";
import ValuesBox from "../ValuesBox/ValuesBox";

const SurvivalPaymentDisplay: FC = () => {
    const { time } = useGameTime();

    const formatNumber = (num: number) => {
        if (num > 1000000) {
            return Math.floor(num / 1000000) + "M";
        }
        if (num > 1000) {
            return Math.floor(num / 1000) + "k";
        }
        return num.toString();
    };

    return (
        <div className={styles.survivalDisplay + " border"}>
            <div className={styles.time}>
                <span className={styles.quarter}>Y{Math.floor(time.currentQuarter || 0 / 4)}</span>
                <span className={styles.quarter}>Q{time.currentQuarter || 0 % 4}</span>
            </div>
            <div>
                <ValuesBox iconKey="money" text={time.nextPayment?.toString() || "0"}/>
            </div>
        </div>
    );
};

export default SurvivalPaymentDisplay;
