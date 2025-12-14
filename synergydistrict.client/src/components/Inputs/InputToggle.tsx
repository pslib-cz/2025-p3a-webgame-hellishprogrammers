import { type FC } from "react";
import ShowInfo from "../ShowInfo";
import ToggleButton from "../ToggleButton";

type InputToggleProps = {
  text: string;
  options: string[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
};

const InputToggle: FC<InputToggleProps> = ({ text, options, selectedIndex, onChange }) => {
  const left = () => {
    return <span>{text}</span>;
  };

  const right = () => {
    return <ToggleButton options={options} selectedIndex={selectedIndex} onChange={onChange} />;
  };

  return <ShowInfo left={left()} right={right()} />;
};

export default InputToggle;
