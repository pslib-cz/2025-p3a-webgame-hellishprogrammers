import { useState, type FC, useEffect } from "react";
import TextButton from "../TextButton/TextButton";
import styles from "./ToggleButton.module.css";

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
        <div className={`${styles.toggleButtons} border`}>
            {options.map((option, index) => (
                <TextButton key={index} text={option} onClick={() => handleClick(index)} isActive={index === active} />
            ))}
        </div>
    );
};

export default ToggleButton;
