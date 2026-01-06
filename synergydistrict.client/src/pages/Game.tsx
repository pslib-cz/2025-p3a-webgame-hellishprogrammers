import { useState } from "react";
import styles from "../styles/Game.module.css";
import GameCanvas from "../components/Game/KonvaNew/GameCanvas";
import { GamePropertiesProvider } from "../provider/GamePropertiesProvider";
import { GameVariablesProvider } from "../provider/GameVariablesProvider";
import GameBar from "./Game/GameBar/GameBar";
import { GameDataProvider } from "../provider/GameDataProvider";
import { BuildingsBitmapProvider } from "../provider/BuildingsBitmapProvider";

const Game = () => {
    const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);

    // const makeEdge = (shape: BuildingTileType[][], position: Position, side: EdgeSide): Edge | null => {
    //     //console.log(`Origin position x:${position.x} y:${position.y}`)
    //     const target: Position = {x: position.x, y:position.y}

    //     switch (side) {
    //         case "top":
    //             target.y += -1;
    //             break;
    //         case "bottom":
    //             target.y += 1;
    //             break;
    //         case "left":
    //             target.x += -1;
    //             break;
    //         case "right":
    //             target.x += 1;
    //             break;
    //     }

    //     if (target.x < 0 || target.x >= shape.length || target.y < 0 || target.y >= shape[target.x].length || shape[target.x][target.y] == "Empty") {
    //         console.log(`Edge found: ${side} at position x:${position.x} y:${position.y}`)
    //         console.log(`Target war: at position x:${target.x} y:${target.y}`)
    //         return {
    //             position: position,
    //             side: side,
    //             synergy: null
    //         }
    //     }

    //     console.log(null)
    //     return null;
    // }

    return (
        <GameDataProvider>
            <GamePropertiesProvider>
                <GameVariablesProvider>
                    <div className={styles.game}>
                        <BuildingsBitmapProvider>
                        <GameCanvas selectedBuilding={selectedBuilding} disableDynamicLoading={true} />
                        </BuildingsBitmapProvider>
                        <GameBar setBuilding={(x) => setSelectedBuilding(x)} />
                    </div>
                </GameVariablesProvider>
            </GamePropertiesProvider>
        </GameDataProvider>
    );
};

export default Game;
