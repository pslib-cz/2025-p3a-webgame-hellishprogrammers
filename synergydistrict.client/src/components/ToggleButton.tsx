import { useState, type FC } from "react";
import BorderLayout from "./BorderLayout";
import TextButton from "./TextButton";

type ToggleButtonProps = {
  options: string[];
};

const ToggleButton: FC<ToggleButtonProps> = ({ options }) => {
  const [active, setActive] = useState<number>(0);
  return (
    <div>
      {options.map((option, index) => (
        <BorderLayout key={index}>
          <TextButton text={option} onClick={() => setActive(index)} isActive={index === active} />
        </BorderLayout>
      ))}
    </div>
  );
};

export default ToggleButton;
