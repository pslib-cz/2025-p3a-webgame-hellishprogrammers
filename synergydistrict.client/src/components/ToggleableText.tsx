import type { FC } from "react";

type ToggleableTextProps = {
  text: string;
  isActive: boolean;
};

export const ToggleableText: FC<ToggleableTextProps> = ({ text, isActive }) => {
  const displayedText = isActive ? `[ ${text} ]` : `< ${text} >`;
  return <span>{displayedText}</span>;
};

export default ToggleableText;
