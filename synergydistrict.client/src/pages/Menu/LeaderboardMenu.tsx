import Construction from "../../components/Construction";
import { useGameData } from "../../hooks/providers/useGameData";
import BuildingDocs from "../Game/BuildingDocs/BuildingDocs";

const LeaderboardMenu = () => {
    const { buildings } = useGameData();

    return <BuildingDocs building={buildings[0]} />;
};

export default LeaderboardMenu;
