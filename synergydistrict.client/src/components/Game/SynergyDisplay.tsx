import ProductionListing from "./ProductionListing/ProductionListing";
import ValuesBox from "./ValuesBox/ValuesBox";
import type { Production } from "../../types/Game/Buildings";

type SynergyDisplayProps = {
    id: string;
    amount: number | null;
    name: string;
    productions: Production[];
};

const SynergyDisplay: React.FC<SynergyDisplayProps> = ({ id, amount, name, productions }) => {
    return (
        <ProductionListing key={`incoming-${id}`} title={`${name} ${amount ? `${amount}x` : ""}`}>
            {productions.map((product) => (
                <ValuesBox
                    key={`${product.type}-${product.value}`}
                    iconKey={product.type.toLowerCase()}
                    text={product.value.toString()}
                />
            ))}
        </ProductionListing>
    );
};

export default SynergyDisplay;
