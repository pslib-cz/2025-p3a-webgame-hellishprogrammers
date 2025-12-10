import type { FC } from "react";

type ButtonTextProps = {
  text: string;
  isActive: boolean;
};

export const ButtonText: FC<ButtonTextProps> = ({ text, isActive }) => {
  const displayedText = isActive ? `[ ${text} ]` : `< ${text} >`;
  return <span>{displayedText}</span>;
};

export default ButtonText;
