import { useState, type FC, useEffect } from "react";
import TextButton from "../TextButton/TextButton";
import styles from "./ToggleButton.module.css";
import { IconButton } from "../IconButton/IconButton";

type ToggleButtonProps = {
    options: string[];
    selectedIndex?: number;
    onChange?: (index: number) => void;
    isIcons?: boolean;
    disabledIndices?: number[];
};

const ToggleButton: FC<ToggleButtonProps> = ({ options, selectedIndex = 0, onChange, isIcons, disabledIndices }) => {
    const [active, setActive] = useState<number>(selectedIndex);

    useEffect(() => {
        setActive(selectedIndex);
    }, [selectedIndex]);

    const handleClick = (index: number) => {
        if (disabledIndices?.includes(index)) return;
        setActive(index);
        onChange?.(index);
    };

    return (
        <div className={`${styles.toggleButtons} border`}>
            {options.map((option, index) => {
                const isDisabled = disabledIndices?.includes(index) ?? false;
                return isIcons
                    ? <IconButton key={index} iconKey={option} OnClick={() => handleClick(index)} isActive={index == active} disabled={isDisabled} />
                    : <TextButton key={index} text={option} onClick={() => handleClick(index)} isActive={index === active} disabled={isDisabled} />
            })}
        </div>
    );
};

export default ToggleButton;
