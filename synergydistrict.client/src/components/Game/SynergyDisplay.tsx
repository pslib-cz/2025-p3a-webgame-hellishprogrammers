import ProductionListing from "./ProductionListing/ProductionListing";
import ValuesBox from "./ValuesBox/ValuesBox";
import type { ProductionProjection } from "../../types/Game/Buildings";

type SynergyDisplayProps = {
    id: string;
    amount: number | null;
    name: string;
    productions: ProductionProjection[];
    highlight?: boolean;
};

const SynergyDisplay: React.FC<SynergyDisplayProps> = ({ id, amount, name, productions, highlight }) => {
    const highlightStyle: React.CSSProperties | undefined = highlight
        ? {
              boxShadow: "0 0 .8rem var(--text)",
          }
        : undefined;

    return (
        <ProductionListing key={`incoming-${id}`} title={`${name} ${amount ? `${amount}x` : ""}`} style={{...highlightStyle, opacity: productions.every(p => p.detlaValue > 0) ? 0.3 : 1}}>
            {productions.map((proj) => {
                const product = proj.production;
                const isUnaffordable = proj.detlaValue > 0;
                return (
                    <ValuesBox
                        key={`${product.type}-${product.value}`}
                        iconKey={product.type.toLowerCase() == "energy" ? "electricity" : product.type.toLowerCase()}
                        text={product.value.toString()}
                        style={{ opacity: isUnaffordable ? 0.3 : 1 } as React.CSSProperties}
                    />
                );
            })}
        </ProductionListing>
    );
};

export default SynergyDisplay;
