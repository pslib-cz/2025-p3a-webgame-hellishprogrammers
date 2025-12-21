import { type FC } from "react";
import ShowInfo from "../ShowInfo/ShowInfo";
import ToggleButton from "../Buttons/ToggleButton/ToggleButton";
import styles from "../Buttons/ToggleButton/ToggleButton.module.css";

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
        return (
            <div className={styles.toggleButtonsNarrow}>
                <ToggleButton options={options} selectedIndex={selectedIndex} onChange={onChange} />
            </div>
        );
    };

    return <ShowInfo left={left()} right={right()} />;
};

export default InputToggle;
