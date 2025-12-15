import { useState, type FC } from "react";
import { IconButton } from "./IconButton";
type BuildingButtonProps = {
    amount: number;
    buildingIconName: string;
    OnClick: () => void;
};

export const BuildingButton: FC<BuildingButtonProps> = (props: BuildingButtonProps) => {
    const handleOnClick = (inString: string) => {
        setActive(inString);
        props.OnClick();
    };
    const [active, setActive] = useState<string>();
    return (
        <IconButton
            OnClick={() => handleOnClick(props.buildingIconName)}
            isSelected={active == props.buildingIconName}
            iconKey={props.buildingIconName}
            amount={props.amount}
        ></IconButton>
    );
};
