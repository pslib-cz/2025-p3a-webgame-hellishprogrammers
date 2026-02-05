import "../styles/icons.css";

export const GetIcon = (ligature: string) => {
    return (
        <span translate="no" className="icon">
            {ligature}
        </span>
    );
};

export const IconClose = () => GetIcon("close");
