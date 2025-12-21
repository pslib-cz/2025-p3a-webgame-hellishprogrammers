import { useState, type FC } from "react";
import { IconButton } from "../Buttons/IconButton/IconButton";
import BorderLayout from "../BorderLayout/BorderLayout";

type timerSpeed = "pause" | "play" | "fastforward";

type TimeControlProps = {
    selectedTimer: (timerSpeed: timerSpeed) => void;
};

export const TimeControl: FC<TimeControlProps> = ({ selectedTimer }) => {
    const handleOnClick = (instring: timerSpeed) => {
        setActive(instring);
        selectedTimer(instring);
    };
    const [active, setActive] = useState<timerSpeed>();
    return (
        <BorderLayout>
            <IconButton OnClick={() => handleOnClick("pause")} isSelected={active == "pause"} iconKey="pause" />
            <IconButton OnClick={() => handleOnClick("play")} isSelected={active == "play"} iconKey="play" />
            <IconButton
                OnClick={() => handleOnClick("fastforward")}
                isSelected={active == "fastforward"}
                iconKey="fastforward"
            />
        </BorderLayout>
    );
};
