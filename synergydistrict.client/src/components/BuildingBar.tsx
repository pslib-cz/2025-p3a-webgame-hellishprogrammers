import { useState, type FC } from "react"
import { BuildingButton } from "./BuildingButton"
type BuildingBarProps = {
    buttonName:string
    amount:number

}

export const BuildingBar:FC<BuildingBarProps> = (props:BuildingBarProps) => {
    const handleOnClick = (buildingName:string) => {
        setActive(buildingName)
    }
    const [active,setActive] = useState<string>()
    return(
        <div className="bar">
            <BuildingButton OnClick={() => handleOnClick("townhall")}
            isSelected={active == props.buttonName}
            amount={props.amount} buildingIconName={props.buttonName}
            />
            <BuildingButton OnClick={() => handleOnClick("townhall")}
            isSelected={active == props.buttonName}
            amount={props.amount} buildingIconName={props.buttonName}
            />
            <BuildingButton OnClick={() => handleOnClick("townhall")}
            isSelected={active == props.buttonName}
            amount={props.amount} buildingIconName={props.buttonName}
            />
        </div>
    )
}