import { type FC } from "react";
import ShowInfo from "../ShowInfo";
import ToggleButton from "../ToggleButton";

type InputToggleProps = {
  text: string;
  options: string[];
};

const InputToggle: FC<InputToggleProps> = ({ text, options }) => {
  const left = () => {
    return <span>{text}</span>;
  };

  const right = () => {
    return <ToggleButton options={options} />;
  };

  return <ShowInfo left={left()} right={right()} />;
};

export default InputToggle;
