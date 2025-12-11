import { useState,type  FC } from "react"
import { IconButton } from "./IconButton"
type timerSpeed = "pause"|"play"|"fastforward"
type TimeControlProps = {
    selectedTimer:(timerSpeed:timerSpeed) => void,
}
export const TimeControl:FC<TimeControlProps> = ({selectedTimer}) => {
    const handleOnClick = (instring:timerSpeed) => {
        setActive(instring)
        selectedTimer(instring)
    }
    const [active, setActive] = useState<timerSpeed>();
    return(
        <>
        <IconButton OnClick={() => handleOnClick("pause")}  isSelected={active == "pause"} iconKey=""/>
        <IconButton OnClick={() => handleOnClick("play")} isSelected={active == "play"} iconKey=""/>
        <IconButton OnClick={() => handleOnClick("fastforward")} isSelected={active == "fastforward"} iconKey=""/>
        </>
    )
}