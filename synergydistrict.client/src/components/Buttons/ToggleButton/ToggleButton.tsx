import { useState, type FC, useEffect } from "react";
import TextButton from "../TextButton/TextButton";
import styles from "./ToggleButton.module.css";
import { IconButton } from "../IconButton/IconButton";

type ToggleButtonProps = {
    options: string[];
    selectedIndex?: number;
    onChange?: (index: number) => void;
    isIcons?: boolean;
};

const ToggleButton: FC<ToggleButtonProps> = ({ options, selectedIndex = 0, onChange, isIcons }) => {
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
                isIcons ? <IconButton key={index} iconKey={option} OnClick={() => handleClick(index)} isActive={index == active}/>
                : <TextButton key={index} text={option} onClick={() => handleClick(index)} isActive={index === active} />
            ))}
        </div>
    );
};

export default ToggleButton;
