import type { FC } from "react";
import type { StatType } from "../types";

type StatDisplayProps = {
  statType: StatType;
  value: string;
};

export const StatDisplay: FC<StatDisplayProps> = ({ statType, value }) => {
  return (
    <div className="stat-display">
      <span className="stat-type">{statType}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
};

export default StatDisplay;
