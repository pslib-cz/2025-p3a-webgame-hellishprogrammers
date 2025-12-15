import { useState } from 'react';
import { GameCanvas } from '../components/Game/Canvas/GameCanvas';
import type { BuildingPreview, BuildingTileType } from '../types/Buildings';
import type { MapBuilding, Position, Edge, EdgeSide } from '../types/Grid';

export default function Game() {
    const [position, setPosition] = useState<Position>({x: 0, y: 0})
    const [buildings, setBuildings] = useState<MapBuilding[]>([])

    const placeholderBuilding: BuildingPreview = {
        buildingId: 0,
        name: "townhall",
        category: "Commercial",
        colorHex: "",
        iconKey: "",
        shape: [
            ["Icon", "Solid", "Empty"],
            ["Empty", "Solid", "Solid"],
            ["Solid", "Solid", "Solid"]
        ]
    }

    const buildBuilding = (building: BuildingPreview, position: Position): MapBuilding => {

        const edges: Edge[] = []
        for (let i = 0; i < building.shape.length; i++) {
            const row = building.shape[i]
            for (let j = 0; j < row.length; j++) {
                const temp = [];
                temp.push(makeEdge(building.shape, { x: i, y: j }, "top"));
                temp.push(makeEdge(building.shape, { x: i, y: j }, "bottom"));
                temp.push(makeEdge(building.shape, { x: i, y: j }, "left"));
                temp.push(makeEdge(building.shape, { x: i, y: j }, "right"));

                edges.push(...temp.filter(e => e != null))
            }

        }

        return {
            buildingType: building,
            position: position,
            shape: building.shape, //will rotate
            isSelected: false,
            edges: edges
        }
    }

    const makeEdge = (shape: BuildingTileType[][], position: Position, side: EdgeSide): Edge | null => {
        //console.log(`Origin position x:${position.x} y:${position.y}`)
        const target: Position = {x: position.x, y:position.y}

        switch (side) {
            case "top":
                target.y += -1;
                break;
            case "bottom":
                target.y += 1;
                break;
            case "left":
                target.x += -1;
                break;
            case "right":
                target.x += 1;
                break;
        }

        if (target.x < 0 || target.x >= shape.length || target.y < 0 || target.y >= shape[target.x].length || shape[target.x][target.y] == "Empty") {
            console.log(`Edge found: ${side} at position x:${position.x} y:${position.y}`)
            console.log(`Target war: at position x:${target.x} y:${target.y}`)
            return {
                position: position,
                side: side,
                synergy: null
            }
        }

        console.log(null)
        return null;
    }

    const handleOnClick = () => {
        setBuildings(bs => [...bs, buildBuilding(placeholderBuilding, position)])
    }

    return (
        <div>
            <GameCanvas buildings={buildings}/>
            <button onClick={handleOnClick}>Build</button>
            <input type='number' onChange={(e) =>   setPosition(p => ({...p,x: parseInt(e.target.value)}))}></input>
            <input type='number' onChange={(e) =>   setPosition(p => ({...p,y: parseInt(e.target.value)}))}></input>
        </div>
    );
}
