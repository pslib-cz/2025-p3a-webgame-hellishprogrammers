import { type FC } from "react";
import styles from "./SurvivalPaymentDisplay.module.css"
import useGameTime from "../../../hooks/providers/useGameTime";
import ValuesBox from "../ValuesBox/ValuesBox";
import Tooltip from "../../Tooltip/Tooltip";
import TooltipContainer from "../../Tooltip/TooltipContainer";

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
        <div className={styles.survivalDisplay}>
            <TooltipContainer content={<Tooltip title="Time display" description={`Diplays the current year and quater.`}/>} position="bottom">
                <div className={styles.time + " border--narrow"}>
                    <span className={styles.quarter}>Year: {Math.floor(time.currentQuarter || 0 / 4)}</span>
                    <span className={styles.quarter}>Quater: {time.currentQuarter || 0 % 4}</span>
                </div>
            </TooltipContainer>
            <TooltipContainer content={<Tooltip title="Taxes" description={"This is the tax you have to pay to at the end of the month"}/>} position="bottom">
                <div className={styles.value + " border--narrow"}>
                    <span>Tax:</span>
                    <ValuesBox iconKey="money" text={time.nextPayment?.toString() || "0"} />
                </div>
            </TooltipContainer>
        </div>
    );
};

export default SurvivalPaymentDisplay;
