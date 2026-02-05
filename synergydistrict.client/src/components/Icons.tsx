import "../styles/icons.css";

export const GetIcon = (ligature: string) => {
    return <span translate="no" style={{fontFamily: "icons"}}>{ligature}</span>
}

export const IconClose = () => GetIcon("close");

