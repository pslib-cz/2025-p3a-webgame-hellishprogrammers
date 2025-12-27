import { useState } from "react";
import styles from "../styles/Game.module.css";
import GameCanvas from "../components/Game/HTMLCanvas/GameCanvas";
import { GamePropertiesProvider } from "../provider/GamePropertiesProvider";
import { GameVariablesProvider } from "../provider/GameVariablesProvider";
import GameBar from "./Game/GameBar/GameBar";
import { GameDataProvider } from "../provider/GameDataProvider";

const Game = () => {
    const [buildingDocsId, setBuildingDocsId] = useState<number | null>(null);

    return (
        <GameDataProvider>
            <GameVariablesProvider>
                <div className={styles.game}>
                    <GamePropertiesProvider>
                        <GameCanvas />
                    </GamePropertiesProvider>
                    <GameBar setBuilding={(x) => setBuildingDocsId(x)} />
                </div>
            </GameVariablesProvider>
        </GameDataProvider>
    );
};

export default Game;
