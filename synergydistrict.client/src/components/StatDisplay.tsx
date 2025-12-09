import type React from "react";
import type {FC} from "react"

type StatType = "electricity" | "people" | "happiness" | "money" | "industry";

type StatDisplayProps = {
    statType: StatType;
    value: string;
}

export const StatDisplay: FC<StatDisplayProps> = ({ statType, value }) => { 
    return (
    <div className="stat-display">
      <span className="stat-type">{statType}</span>
      <span className="stat-value">{value}</span>
    </div>
  );}
 
export default StatDisplay;