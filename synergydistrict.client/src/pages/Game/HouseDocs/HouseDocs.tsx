import type { FC } from "react";
import { useGameData } from "../../../hooks/providers/useGameData";
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
                    {/* <div><h2>Cost</h2>
                        <p>{houseInfo?.cost}</p></div>
                    <p></p> tohle musí být další componenta*/}
                </main>
            </>
        )
    }


}
export default HouseDocs;