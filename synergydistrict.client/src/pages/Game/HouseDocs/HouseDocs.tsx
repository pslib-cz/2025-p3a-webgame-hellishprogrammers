import type { FC } from "react";
import { useGameData } from "../../../hooks/providers/useGameData";
import ProductionListing from "../../../components/Game/ProductionListing/ProductionListing";
import ValuesBox from "../../../components/Game/ValuesBox/ValuesBox";
import ShowInfo from "../../../components/ShowInfo/ShowInfo";
type HouseDocsProps = {
    BuildingId: number
}

const HouseDocs: FC<HouseDocsProps> = ({ BuildingId }) => {
    const { buildings } = useGameData();
    if (BuildingId == null) {
        return (
            <>
            </>
        )
    }
    else {
        const houseInfo = buildings.find(x => x.buildingId == BuildingId)

        return (
            <>
                <header>
                    <h1>{houseInfo?.name}</h1>
                    <span className="icon">{houseInfo?.iconKey}</span>
                </header>
                <main>
                    <p>{houseInfo?.description}</p>
                    <ProductionListing title="Cost"><ValuesBox iconKey="money" text={`${houseInfo?.cost}`}/></ProductionListing>
                    {houseInfo?.baseProduction.map(x => <ShowInfo  key={`${x.type}${x.value}`} left={<div className="icon">{x.type.toLowerCase()=="energy" ? "electricity" : x.type.toLowerCase()}</div>} right={<>{x.value}</>}/>)}
                </main>
            </>
        )
    }


}
export default HouseDocs;