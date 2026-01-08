import type { FC, ReactElement } from "react";

type ProductionListingProps = {
    title:string;
    children:ReactElement
}

export const ProductionListing:FC<ProductionListingProps> = ({ title, children }) => {

        return (
            <>
                <header>
                    <h1>{title}</h1>
                </header>
                <main>
                    {children}
                </main>
            </>
        )
}
export default ProductionListing;