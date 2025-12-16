import { useState, type FC } from "react";
import { IconButton } from "./IconButton";
import BorderLayout from "./BorderLayout";
type BuildingButtonProps = {
    amount: number;
    buildingIconName: string;
    isSelected: boolean;
    OnClick: () => void;
};

export const BuildingButton: FC<BuildingButtonProps> = (props: BuildingButtonProps) => {
    const handleOnClick = (inString: string) => {
        props.OnClick();
    };
    return (
        <BorderLayout>
        <IconButton
            OnClick={() => handleOnClick(props.buildingIconName)}
            isSelected={props.isSelected}
            iconKey={props.buildingIconName}
            amount={props.amount}
        ></IconButton>
        </BorderLayout>
    );
};
