import { useState } from "react";
import styles from "../styles/Game.module.css";
import GameCanvas from "../components/Game/Rendering/GameCanvas";
import GameBar from "./Game/GameBar/GameBar";
import { BuildingsBitmapProvider } from "../provider/BuildingsBitmapProvider";
import { useGameOptions } from "../hooks/providers/useGameOptions";
import type { MapBuilding, Position } from "../types/Game/Grid";
import { CanPlaceBuilding, createEgdesForShape, CalculateValues, rotateShape, CanAfford } from "../utils/PlacingUtils";
import type { BuildingType } from "../types/Game/Buildings";
import { useGameData } from "../hooks/providers/useGameData";
import useGameMapData from "../hooks/providers/useMapData";
import useGameResources from "../hooks/providers/useGameResources";

const Game = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [buildingPreview, setBuildingPreview] = useState<MapBuilding | null>(null);
  const { options } = useGameOptions();
  const { GameMapData, setGameMapData } = useGameMapData();
  const { GameResources, setGameResources} = useGameResources();
  const { synergies } = useGameData();

  const OnMapClick = (position: Position) => {
    if (selectedBuilding === null) return;

    if (
      CanPlaceBuilding(
        buildingPreview!.shape,
        position,
        GameMapData.placedBuildingsMappped,
        GameMapData.loadedMapTiles
      )
      &&
      CanAfford(buildingPreview!.buildingType, GameResources)
    ) {
      const newBuilding: MapBuilding = {
        buildingType: selectedBuilding,
        MapBuildingId: crypto.randomUUID(),
        position: position,
        edges: buildingPreview!.edges,
        rotation: buildingPreview!.rotation,
        shape: buildingPreview!.shape,
        isSelected: false,
      };

      const newValues = CalculateValues(newBuilding, GameMapData.placedBuildingsMappped, synergies, GameResources);
      console.log("New values after placing:", newValues);
      if (!newValues) return;

      setGameResources(newValues);

      setGameMapData((prev) => ({
        ...prev,
        placedBuildings: [...prev.placedBuildings, newBuilding],
        placedBuildingsMappped: {
          ...prev.placedBuildingsMappped,
          ...Object.fromEntries(
            newBuilding.shape
              .map((row, y) =>
                row
                  .map((tile, x) =>
                    tile !== "Empty"
                      ? [
                        `${newBuilding.position.x + x};${newBuilding.position.y + y}`,
                        newBuilding,
                      ]
                      : null
                  )
                  .filter((entry): entry is [string, MapBuilding] => entry !== null)
              )
              .flat()
          ),
        },
      }));
    }
  };

  const OnPlaceSelect = (building: BuildingType | null) => {
    setSelectedBuilding(building);

    if (building === null) {
      setBuildingPreview(null);
      return;
    }

    const shape = building.shape;
    const edges = createEgdesForShape(shape);

    const prewiewBuilding: MapBuilding = {
      buildingType: building,
      MapBuildingId: "preview",
      position: { x: 0, y: 0 },
      edges: edges,
      rotation: 0,
      shape: shape,
      isSelected: false,
    };

    setBuildingPreview(prewiewBuilding);
  };

  const OnRotate = () => {
    if (buildingPreview === null) return;

    const newRotation = (buildingPreview.rotation + 1) % 4;
    const newShape = rotateShape(buildingPreview.shape, 1);
    const newEdges = createEgdesForShape(newShape);
    setBuildingPreview({
      ...buildingPreview,
      rotation: newRotation,
      shape: newShape,
      edges: newEdges,
    });
  };

  return (
    <div className={styles.game}>
      <BuildingsBitmapProvider>
        <GameCanvas
          disableDynamicLoading={!options.infiniteMap}
          onMapClick={OnMapClick}
          onContext={OnRotate}
          previewBuilding={buildingPreview}
        />
      </BuildingsBitmapProvider>
      <GameBar setBuilding={OnPlaceSelect} />
    </div>
  );
};

export default Game;
