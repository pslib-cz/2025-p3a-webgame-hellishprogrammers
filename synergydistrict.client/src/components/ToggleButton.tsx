import { useState, type FC, useEffect } from "react";
import BorderLayout from "./BorderLayout";
import TextButton from "./TextButton";
import styles from "../styles/ToggleButton.module.css";

type ToggleButtonProps = {
  options: string[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
};

const ToggleButton: FC<ToggleButtonProps> = ({ options, selectedIndex = 0, onChange }) => {
  const [active, setActive] = useState<number>(selectedIndex);

  useEffect(() => {
    setActive(selectedIndex);
  }, [selectedIndex]);

  const handleClick = (index: number) => {
    setActive(index);
    onChange?.(index);
  };

  return (
    <BorderLayout>
      <div className={styles.toggleButtons}>
        {options.map((option, index) => (
          <TextButton key={index} text={option} onClick={() => handleClick(index)} isActive={index === active} />
        ))}
      </div>
    </BorderLayout>
  );
};

export default ToggleButton;
