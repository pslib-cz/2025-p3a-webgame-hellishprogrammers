import { useState, type FC, useEffect, type ReactNode } from "react";
import TextButton from "../TextButton/TextButton";
import styles from "./ToggleButton.module.css";
import { IconButton } from "../IconButton/IconButton";
import TooltipContainer from "../../Tooltip/TooltipContainer";

type ToggleButtonProps = {
    options: string[];
    tooltips?: ReactNode[];
    selectedIndex?: number;
    onChange?: (index: number) => void;
    isIcons?: boolean;
    disabledIndices?: number[];
};

const ToggleButton: FC<ToggleButtonProps> = ({ options, selectedIndex = 0, onChange, isIcons, disabledIndices, tooltips }) => {
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
                return (
                    <TooltipContainer content={tooltips?.[index] ?? null} key={index}>
                        {isIcons ? (
                            <IconButton
                                iconKey={option}
                                OnClick={() => handleClick(index)}
                                isActive={index == active}
                                disabled={isDisabled}
                            />
                        ) : (
                            <TextButton
                                text={option}
                                onClick={() => handleClick(index)}
                                isActive={index === active}
                                disabled={isDisabled}
                            />
                        )
                        }
                    </TooltipContainer>
                )
            })
            }
        </div>
    );
};

export default ToggleButton;
